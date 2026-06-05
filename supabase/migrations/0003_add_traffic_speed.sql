-- Add traffic counters + current speed to fleet devices, and let the heartbeat
-- RPC carry them. Idempotent. Existing 8-arg callers keep working (all new args
-- have defaults).

alter table public.fleet_devices
  add column if not exists rx_bytes        bigint,   -- cumulative downloaded bytes
  add column if not exists tx_bytes        bigint,   -- cumulative uploaded bytes
  add column if not exists speed_down_bps  bigint,   -- current download speed (bits/sec)
  add column if not exists speed_up_bps    bigint;   -- current upload speed (bits/sec)

drop function if exists public.report_device_heartbeat(text, text, text, text, text, timestamptz, text, text, text);

create or replace function public.report_device_heartbeat(
  p_account_id     text,
  p_device_id      text,
  p_device_token   text,
  p_public_ip      text,
  p_app_version    text,
  p_reported_at    timestamptz,
  p_trigger        text,
  p_vpn_state      text,
  p_mac_address    text   default null,
  p_rx_bytes       bigint default null,
  p_tx_bytes       bigint default null,
  p_speed_down_bps bigint default null,
  p_speed_up_bps   bigint default null
) returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_dev fleet_devices%rowtype;
begin
  select * into v_dev from fleet_devices where device_id = p_device_id;
  if not found then
    return json_build_object('success', false, 'error', 'Device not enrolled.');
  end if;
  if v_dev.device_token <> encode(digest(coalesce(p_device_token, ''), 'sha256'), 'hex') then
    return json_build_object('success', false, 'error', 'Invalid device token.');
  end if;

  update fleet_devices set
    public_ip      = coalesce(p_public_ip,      public_ip),
    app_version    = coalesce(p_app_version,    app_version),
    vpn_state      = coalesce(p_vpn_state,      vpn_state),
    last_trigger   = coalesce(p_trigger,        last_trigger),
    mac_address    = coalesce(p_mac_address,    mac_address),
    rx_bytes       = coalesce(p_rx_bytes,       rx_bytes),
    tx_bytes       = coalesce(p_tx_bytes,       tx_bytes),
    speed_down_bps = coalesce(p_speed_down_bps, speed_down_bps),
    speed_up_bps   = coalesce(p_speed_up_bps,   speed_up_bps),
    last_seen_at   = coalesce(p_reported_at,    now())
  where device_id = p_device_id;

  return json_build_object('success', true);
end;
$$;

grant execute on function public.report_device_heartbeat(
  text, text, text, text, text, timestamptz, text, text, text, bigint, bigint, bigint, bigint
) to anon, authenticated;
