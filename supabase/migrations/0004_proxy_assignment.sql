-- Residential proxy: per-device gateway assignment + a config RPC the device agent
-- calls to learn how to dial the gateway. Idempotent.

alter table public.fleet_devices
  add column if not exists gateway_host      text,
  add column if not exists gateway_port      int,
  add column if not exists interconnect_uuid text,
  add column if not exists sentinel          text,
  add column if not exists socks_port        int,    -- per-device SOCKS port on the gateway
  add column if not exists socks_user        text,   -- customer-facing creds for this device's exit
  add column if not exists socks_pass        text,
  add column if not exists exit_enabled      boolean default true;

-- Device agent calls this (with its device token) to fetch how to dial the gateway.
create or replace function public.get_proxy_config(p_device_id text, p_device_token text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v fleet_devices%rowtype;
begin
  select * into v from fleet_devices where device_id = p_device_id;
  if not found then
    return json_build_object('success', false, 'error', 'not enrolled');
  end if;
  if v.device_token <> encode(digest(coalesce(p_device_token, ''), 'sha256'), 'hex') then
    return json_build_object('success', false, 'error', 'bad token');
  end if;
  if v.gateway_host is null or v.interconnect_uuid is null then
    return json_build_object('success', true, 'assigned', false);
  end if;
  return json_build_object(
    'success',      true,
    'assigned',     true,
    'enabled',      coalesce(v.exit_enabled, true),
    'gateway_host', v.gateway_host,
    'gateway_port', v.gateway_port,
    'uuid',         v.interconnect_uuid,
    'sentinel',     v.sentinel
  );
end;
$$;

grant execute on function public.get_proxy_config(text, text) to anon, authenticated;
