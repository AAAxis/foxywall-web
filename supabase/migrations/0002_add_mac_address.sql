-- Add MAC address (hardware unique identifier) to fleet devices, and let the
-- heartbeat RPC carry it. Idempotent.

alter table public.fleet_devices add column if not exists mac_address text;

-- Recreate the heartbeat RPC with an optional p_mac_address (default null keeps
-- existing 8-arg callers — e.g. the current Android build — working unchanged).
drop function if exists public.report_device_heartbeat(text, text, text, text, text, timestamptz, text, text);

create or replace function public.report_device_heartbeat(
  p_account_id   text,
  p_device_id    text,
  p_device_token text,
  p_public_ip    text,
  p_app_version  text,
  p_reported_at  timestamptz,
  p_trigger      text,
  p_vpn_state    text,
  p_mac_address  text default null
) returns json
language plpgsql
security definer
set search_path = public
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
    public_ip    = coalesce(p_public_ip,   public_ip),
    app_version  = coalesce(p_app_version, app_version),
    vpn_state    = coalesce(p_vpn_state,   vpn_state),
    last_trigger = coalesce(p_trigger,     last_trigger),
    mac_address  = coalesce(p_mac_address, mac_address),
    last_seen_at = coalesce(p_reported_at, now())
  where device_id = p_device_id;

  return json_build_object('success', true);
end;
$$;

grant execute on function public.report_device_heartbeat(text, text, text, text, text, timestamptz, text, text, text)
  to anon, authenticated;
