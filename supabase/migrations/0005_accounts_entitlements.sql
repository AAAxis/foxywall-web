-- Accounts + entitlements (the single source of truth for "is this account Pro?").
-- Clients call create_account / get_entitlement (anon). Only the server (service role)
-- or the protected set_entitlement may grant Pro.

create extension if not exists pgcrypto;

create table if not exists public.accounts (
  id                       text primary key,            -- VPN-XXXX-XXXX-XXXX
  created_at               timestamptz not null default now(),
  is_pro                   boolean not null default false,
  pro_expires_at           timestamptz,
  pro_source               text,                        -- paddle | revenuecat | manual
  external_subscription_id text,                        -- paddle/RC subscription id
  email                    text
);

alter table public.accounts enable row level security;   -- locked; RPCs are SECURITY DEFINER

-- ── Code generator: VPN-XXXX-XXXX-XXXX (no ambiguous chars) ────────────────
create or replace function public.gen_account_code()
returns text
language plpgsql
set search_path = public, extensions
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := 'VPN';
  part text;
  i int; g int;
begin
  for g in 1..3 loop
    part := '';
    for i in 1..4 loop
      part := part || substr(alphabet, 1 + (get_byte(gen_random_bytes(1), 0) % length(alphabet)), 1);
    end loop;
    code := code || '-' || part;
  end loop;
  return code;
end;
$$;

-- ── create_account: mint a fresh free account, return its code ─────────────
create or replace function public.create_account()
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_code text;
  v_tries int := 0;
begin
  loop
    v_code := gen_account_code();
    begin
      insert into accounts (id) values (v_code);
      return json_build_object('success', true, 'account_id', v_code);
    exception when unique_violation then
      v_tries := v_tries + 1;
      if v_tries > 6 then
        return json_build_object('success', false, 'error', 'code generation failed');
      end if;
    end;
  end loop;
end;
$$;

-- ── get_entitlement: is this account Pro right now? ────────────────────────
create or replace function public.get_entitlement(p_account_id text)
returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v accounts%rowtype;
begin
  select * into v from accounts where id = upper(trim(p_account_id));
  if not found then
    return json_build_object('exists', false, 'is_pro', false);
  end if;
  return json_build_object(
    'exists', true,
    'is_pro', (v.is_pro and (v.pro_expires_at is null or v.pro_expires_at > now())),
    'expires_at', v.pro_expires_at
  );
end;
$$;

-- ── set_entitlement: grant/revoke Pro. Server-only (webhooks). ─────────────
-- Creates the account if it doesn't exist (web-first purchase path).
create or replace function public.set_entitlement(
  p_account_id   text,
  p_is_pro       boolean,
  p_expires_at   timestamptz default null,
  p_source       text default null,
  p_external_id  text default null,
  p_email        text default null
) returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id text := upper(trim(p_account_id));
begin
  insert into accounts (id, is_pro, pro_expires_at, pro_source, external_subscription_id, email)
  values (v_id, p_is_pro, p_expires_at, p_source, p_external_id, p_email)
  on conflict (id) do update set
    is_pro                   = excluded.is_pro,
    pro_expires_at           = excluded.pro_expires_at,
    pro_source               = coalesce(excluded.pro_source, accounts.pro_source),
    external_subscription_id = coalesce(excluded.external_subscription_id, accounts.external_subscription_id),
    email                    = coalesce(excluded.email, accounts.email);
  return json_build_object('success', true, 'account_id', v_id, 'is_pro', p_is_pro);
end;
$$;

-- ── Grants: clients get create/get; set_entitlement is NOT exposed to anon ──
grant execute on function public.create_account()              to anon, authenticated;
grant execute on function public.get_entitlement(text)         to anon, authenticated;
revoke execute on function public.set_entitlement(text, boolean, timestamptz, text, text, text) from anon, authenticated;
grant  execute on function public.set_entitlement(text, boolean, timestamptz, text, text, text) to service_role;
