-- Auto-assign each enrolled device to a residential-proxy gateway: allocate its
-- interconnect UUID, a unique SOCKS port, a sentinel (reverse-proxy domain), and
-- customer-facing SOCKS creds. The relay agent reads these via list_gateway_devices
-- and renders the Xray portal config. Idempotent.

create table if not exists public.proxy_gateways (
  id             text primary key,                 -- 'gw-se-1'
  host           text not null,                    -- public IP devices dial + customers connect
  port           int  not null,                    -- VLESS interconnect inbound port (device dials)
  socks_port_min int  not null default 20001,
  socks_port_max int  not null default 29999,
  capacity       int  not null default 9000,
  agent_token    text not null,                    -- relay agent auth (list_gateway_devices)
  enabled        boolean not null default true,
  created_at     timestamptz not null default now()
);
alter table public.proxy_gateways enable row level security;  -- locked; SECURITY DEFINER RPCs only

alter table public.fleet_devices add column if not exists gateway_id text references public.proxy_gateways(id);

-- ── assign_gateway: allocate a gateway slot for a device (no-op if already set) ──
create or replace function public.assign_gateway(p_device_id text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_dev  fleet_devices%rowtype;
  v_gw   proxy_gateways%rowtype;
  v_port int;
begin
  select * into v_dev from fleet_devices where device_id = p_device_id for update;
  if not found then return; end if;
  if v_dev.gateway_id is not null and v_dev.gateway_host is not null then
    return;  -- already assigned — keep it stable
  end if;

  -- Least-loaded enabled gateway with free capacity. Lock it so concurrent
  -- registrations serialize on port allocation.
  select g.* into v_gw
  from proxy_gateways g
  where g.enabled
    and (select count(*) from fleet_devices fd where fd.gateway_id = g.id) < g.capacity
  order by (select count(*) from fleet_devices fd where fd.gateway_id = g.id) asc
  limit 1
  for update of g;
  if not found then return; end if;  -- no capacity → stays unassigned, retried next register

  -- Smallest free SOCKS port in this gateway's range.
  select gs into v_port
  from generate_series(v_gw.socks_port_min, v_gw.socks_port_max) gs
  where gs not in (
    select socks_port from fleet_devices
    where gateway_id = v_gw.id and socks_port is not null
  )
  order by gs
  limit 1;
  if v_port is null then return; end if;  -- range exhausted

  update fleet_devices set
    gateway_id        = v_gw.id,
    gateway_host      = v_gw.host,
    gateway_port      = v_gw.port,
    interconnect_uuid = gen_random_uuid()::text,
    sentinel          = 'fx-' || left(encode(gen_random_bytes(8), 'hex'), 16),
    socks_port        = v_port,
    socks_user        = 'u' || left(encode(gen_random_bytes(6), 'hex'), 12),
    socks_pass        = encode(gen_random_bytes(12), 'hex'),
    exit_enabled      = true
  where device_id = p_device_id;
end;
$$;

-- ── register_exit_node: now auto-assigns a gateway after upserting the device ──
create or replace function public.register_exit_node(
  p_account_id  text,
  p_device_id   text,
  p_device_name text,
  p_device_type text
) returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_acc   accounts%rowtype;
  v_token text;
begin
  if coalesce(trim(p_device_id), '') = '' then
    return json_build_object('success', false, 'error', 'Missing device id.');
  end if;

  select * into v_acc from accounts where id = upper(trim(p_account_id));
  if not found then
    return json_build_object('success', false, 'error', 'Unknown license.');
  end if;

  v_token := encode(gen_random_bytes(32), 'hex');

  insert into fleet_devices (account_id, device_id, device_name, device_type, device_token)
  values (
    v_acc.id, trim(p_device_id), p_device_name,
    coalesce(nullif(trim(p_device_type), ''), 'other'),
    encode(digest(v_token, 'sha256'), 'hex')
  )
  on conflict (device_id) do update set
    account_id   = excluded.account_id,
    company_id   = null,
    device_name  = excluded.device_name,
    device_type  = excluded.device_type,
    device_token = excluded.device_token,
    enrolled_at  = now();

  perform public.assign_gateway(trim(p_device_id));

  return json_build_object('success', true, 'account_id', v_acc.id, 'device_token', v_token);
end;
$$;

-- ── list_gateway_devices: the relay agent reads its assigned devices ──────────
create or replace function public.list_gateway_devices(p_gateway_id text, p_agent_token text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_gw proxy_gateways%rowtype;
begin
  select * into v_gw from proxy_gateways where id = p_gateway_id;
  if not found or v_gw.agent_token <> p_agent_token then
    return json_build_object('success', false, 'error', 'unauthorized');
  end if;
  return json_build_object(
    'success', true,
    'gateway', json_build_object('id', v_gw.id, 'host', v_gw.host, 'port', v_gw.port),
    'devices', coalesce((
      select json_agg(json_build_object(
        'device_id',  d.device_id,
        'uuid',       d.interconnect_uuid,
        'sentinel',   d.sentinel,
        'socks_port', d.socks_port,
        'socks_user', d.socks_user,
        'socks_pass', d.socks_pass,
        'enabled',    coalesce(d.exit_enabled, true)
      ) order by d.socks_port)
      from fleet_devices d
      where d.gateway_id = v_gw.id
        and d.interconnect_uuid is not null
        and d.socks_port is not null
    ), '[]'::json)
  );
end;
$$;

grant execute on function public.list_gateway_devices(text, text) to anon, authenticated;
-- assign_gateway is internal (called by register_exit_node); not granted to clients.
revoke all on table public.proxy_gateways from anon, authenticated;
