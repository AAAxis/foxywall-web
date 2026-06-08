-- Browser-proxy credentials, license-gated.
-- The Chrome extension authenticates to the Xray HTTP proxy (:1080) but must NOT
-- ship the password in its bundle. Instead it calls get_proxy_credentials with its
-- account code; the password is returned ONLY when the account is Pro. Rotating the
-- password is a single UPDATE on proxy_settings (+ the matching change in Xray).

create table if not exists public.proxy_settings (
  id         int primary key default 1,
  host       text not null,
  port       int  not null,
  username   text not null,
  password   text not null,
  updated_at timestamptz not null default now(),
  constraint proxy_settings_singleton check (id = 1)
);

alter table public.proxy_settings enable row level security;  -- locked; no policies → only SECURITY DEFINER RPCs (and service_role) can read

-- Seed / refresh the single row with the current Xray HTTP-proxy gateway.
insert into public.proxy_settings (id, host, port, username, password)
values (1, '74.241.135.6', 1080, 'foxy', 'jAZyaAMEzrE3MN7KjrXQ')
on conflict (id) do update set
  host = excluded.host, port = excluded.port,
  username = excluded.username, password = excluded.password,
  updated_at = now();

-- ── get_proxy_credentials: Pro accounts only ──────────────────────────────
-- Reuses the same liveness rule as get_entitlement (is_pro AND not expired).
-- Returns { authorized:false } for unknown / free / expired accounts — never the
-- password. anon-callable: the account code is the credential.
create or replace function public.get_proxy_credentials(p_account_id text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_acc accounts%rowtype;
  v_ps  proxy_settings%rowtype;
begin
  select * into v_acc from accounts where id = upper(trim(p_account_id));
  if not found then
    return json_build_object('authorized', false, 'reason', 'not_found');
  end if;

  if not (v_acc.is_pro and (v_acc.pro_expires_at is null or v_acc.pro_expires_at > now())) then
    return json_build_object('authorized', false, 'reason', 'not_pro');
  end if;

  select * into v_ps from proxy_settings where id = 1;
  if not found then
    return json_build_object('authorized', false, 'reason', 'unconfigured');
  end if;

  return json_build_object(
    'authorized', true,
    'host',       v_ps.host,
    'port',       v_ps.port,
    'username',   v_ps.username,
    'password',   v_ps.password,
    'expires_at', v_acc.pro_expires_at
  );
end;
$$;

-- Clients get execute; the table itself stays unreadable (RLS, no policy).
grant execute on function public.get_proxy_credentials(text) to anon, authenticated;
revoke all   on table    public.proxy_settings            from anon, authenticated;
