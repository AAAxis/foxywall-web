-- FoxyWall fleet schema
-- Companies, provision codes, devices + the two RPCs the apps call:
--   enroll_corporate_device(...)   — IT enrolls a device with a provision code
--   report_device_heartbeat(...)   — device reports its real public IP / state
--
-- Apply to your Supabase project (SQL editor or `supabase db push`).
-- Idempotent: safe to re-run.

create extension if not exists pgcrypto;

-- ── Tables ────────────────────────────────────────────────────────────────

create table if not exists public.companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.provision_codes (
  code        text primary key,
  company_id  uuid not null references public.companies(id) on delete cascade,
  max_uses    integer not null default 100,
  used_count  integer not null default 0,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

create table if not exists public.fleet_devices (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies(id) on delete cascade,
  account_id    text,
  device_id     text not null unique,
  device_name   text,
  device_type   text not null default 'other',   -- ios | android | windows | other
  device_token  text not null,                    -- sha256(token) hex, NOT the raw token
  app_version   text,
  public_ip     text,
  vpn_state     text,                             -- on | off
  last_trigger  text,                             -- periodic | connected | disconnected | boot
  enrolled_at   timestamptz not null default now(),
  last_seen_at  timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists fleet_devices_company_idx   on public.fleet_devices(company_id);
create index if not exists fleet_devices_last_seen_idx  on public.fleet_devices(last_seen_at desc);

-- ── RLS: lock down direct table access ────────────────────────────────────
-- No policies are created, so anon/authenticated clients get NOTHING directly.
-- The RPCs below are SECURITY DEFINER (run as owner), and the dashboard reads
-- via the service-role key (which bypasses RLS) on the server only.

alter table public.companies        enable row level security;
alter table public.provision_codes  enable row level security;
alter table public.fleet_devices    enable row level security;

-- ── RPC: enroll_corporate_device ──────────────────────────────────────────
-- Validates a provision code, upserts the device, mints a 64-hex device token,
-- and returns the token ONCE (only the hash is stored).

create or replace function public.enroll_corporate_device(
  p_provision_code text,
  p_device_id      text,
  p_device_name    text,
  p_device_type    text
) returns json
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_code     provision_codes%rowtype;
  v_company  companies%rowtype;
  v_token    text;
  v_account  text;
begin
  if coalesce(trim(p_device_id), '') = '' then
    return json_build_object('success', false, 'error', 'Missing device id.');
  end if;

  select * into v_code from provision_codes
    where code = upper(trim(p_provision_code))
    for update;
  if not found then
    return json_build_object('success', false, 'error', 'Invalid provision code.');
  end if;
  if v_code.expires_at is not null and v_code.expires_at < now() then
    return json_build_object('success', false, 'error', 'Provision code expired.');
  end if;
  if v_code.used_count >= v_code.max_uses then
    return json_build_object('success', false, 'error', 'Provision code exhausted.');
  end if;

  select * into v_company from companies where id = v_code.company_id;

  v_token   := encode(gen_random_bytes(32), 'hex');               -- 64 hex chars
  v_account := 'CORP-' || replace(v_company.id::text, '-', '');

  insert into fleet_devices (company_id, account_id, device_id, device_name, device_type, device_token)
  values (
    v_company.id, v_account, trim(p_device_id), p_device_name,
    coalesce(nullif(trim(p_device_type), ''), 'other'),
    encode(digest(v_token, 'sha256'), 'hex')
  )
  on conflict (device_id) do update set
    company_id   = excluded.company_id,
    account_id   = excluded.account_id,
    device_name  = excluded.device_name,
    device_type  = excluded.device_type,
    device_token = excluded.device_token,
    enrolled_at  = now();

  update provision_codes set used_count = used_count + 1 where code = v_code.code;

  return json_build_object(
    'success',      true,
    'account_id',   v_account,
    'company_id',   v_company.id,
    'company_name', v_company.name,
    'device_token', v_token
  );
end;
$$;

-- ── RPC: report_device_heartbeat ──────────────────────────────────────────
-- Verifies the device token (by hash) and updates the live fields.

create or replace function public.report_device_heartbeat(
  p_account_id   text,
  p_device_id    text,
  p_device_token text,
  p_public_ip    text,
  p_app_version  text,
  p_reported_at  timestamptz,
  p_trigger      text,
  p_vpn_state    text
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
    public_ip    = coalesce(p_public_ip,   public_ip),
    app_version  = coalesce(p_app_version, app_version),
    vpn_state    = coalesce(p_vpn_state,   vpn_state),
    last_trigger = coalesce(p_trigger,     last_trigger),
    last_seen_at = coalesce(p_reported_at, now())
  where device_id = p_device_id;

  return json_build_object('success', true);
end;
$$;

grant execute on function public.enroll_corporate_device(text, text, text, text)                              to anon, authenticated;
grant execute on function public.report_device_heartbeat(text, text, text, text, text, timestamptz, text, text) to anon, authenticated;

-- ── Example seed (run manually to create a company + provision code) ───────
-- insert into public.companies (name) values ('Acme Corp') returning id;
-- insert into public.provision_codes (code, company_id, max_uses)
--   values ('ACME-2026', '<company-id-from-above>', 50);
