-- Multi-server proxy with tiered access.
--   Free accounts: auto-connect to the default server only.
--   Pro accounts:  choose any enabled server (country selection).
-- Credentials are never listed in bulk — list_proxy_servers returns metadata only;
-- get_proxy_credentials hands out one server's password at connect time.

create table if not exists public.proxy_servers (
  id           text primary key,          -- e.g. 'se-1'
  country      text not null,
  country_code text not null,             -- ISO-3166 alpha-2, for flag rendering
  city         text,
  host         text not null,
  port         int  not null,
  username     text not null,
  password     text not null,
  is_default   boolean not null default false,
  enabled      boolean not null default true,
  sort         int not null default 100,
  updated_at   timestamptz not null default now()
);

alter table public.proxy_servers enable row level security;  -- locked; only SECURITY DEFINER RPCs read it

-- Only one default at a time.
create unique index if not exists proxy_servers_one_default
  on public.proxy_servers (is_default) where is_default;

-- Seed the current Sweden gateway from the old singleton (idempotent).
insert into public.proxy_servers (id, country, country_code, city, host, port, username, password, is_default, sort)
values ('se-1', 'Sweden', 'SE', 'Gävle', '74.241.135.6', 1080, 'foxy', 'jAZyaAMEzrE3MN7KjrXQ', true, 10)
on conflict (id) do update set
  host = excluded.host, port = excluded.port,
  username = excluded.username, password = excluded.password,
  country = excluded.country, country_code = excluded.country_code, city = excluded.city,
  is_default = excluded.is_default, updated_at = now();

-- helper: is this account currently Pro?
create or replace function public.fw_is_pro(p_account_id text)
returns boolean
language sql
security definer
set search_path = public, extensions
as $$
  select coalesce(
    (select is_pro and (pro_expires_at is null or pro_expires_at > now())
       from accounts where id = upper(trim(p_account_id))),
    false);
$$;

-- ── list_proxy_servers: metadata only (NO passwords) ──────────────────────
-- Returns { is_pro, servers:[{id,country,country_code,city,is_default,locked}] }.
-- locked = the free tier can't select this one (everything except the default).
create or replace function public.list_proxy_servers(p_account_id text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_pro boolean := public.fw_is_pro(p_account_id);
begin
  return json_build_object(
    'is_pro', v_pro,
    'servers', coalesce((
      select json_agg(json_build_object(
        'id', s.id, 'country', s.country, 'country_code', s.country_code,
        'city', s.city, 'is_default', s.is_default,
        'locked', (not v_pro and not s.is_default)
      ) order by s.sort, s.country)
      from proxy_servers s where s.enabled
    ), '[]'::json)
  );
end;
$$;

-- ── get_proxy_credentials: creds for one server, tier-enforced ────────────
-- Free  -> always the default server (requested id ignored).
-- Pro   -> requested server if enabled, else the default.
-- Old single-arg version is dropped to avoid PostgREST overload ambiguity.
drop function if exists public.get_proxy_credentials(text);

create or replace function public.get_proxy_credentials(p_account_id text, p_server_id text default null)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_acc accounts%rowtype;
  v_pro boolean;
  v_srv proxy_servers%rowtype;
begin
  select * into v_acc from accounts where id = upper(trim(p_account_id));
  if not found then
    return json_build_object('authorized', false, 'reason', 'not_found');
  end if;

  v_pro := (v_acc.is_pro and (v_acc.pro_expires_at is null or v_acc.pro_expires_at > now()));

  if v_pro and p_server_id is not null then
    select * into v_srv from proxy_servers where id = p_server_id and enabled;
  end if;
  if v_srv.id is null then
    select * into v_srv from proxy_servers where is_default and enabled;
  end if;
  if v_srv.id is null then
    return json_build_object('authorized', false, 'reason', 'unconfigured');
  end if;

  return json_build_object(
    'authorized',   true,
    'is_pro',       v_pro,
    'server_id',    v_srv.id,
    'country',      v_srv.country,
    'country_code', v_srv.country_code,
    'city',         v_srv.city,
    'host',         v_srv.host,
    'port',         v_srv.port,
    'username',     v_srv.username,
    'password',     v_srv.password,
    'expires_at',   v_acc.pro_expires_at
  );
end;
$$;

grant execute on function public.fw_is_pro(text)                        to anon, authenticated;
grant execute on function public.list_proxy_servers(text)               to anon, authenticated;
grant execute on function public.get_proxy_credentials(text, text)      to anon, authenticated;
revoke all on table public.proxy_servers from anon, authenticated;
