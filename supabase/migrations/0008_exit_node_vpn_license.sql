-- Exit node keyed to the VPN-XXXX license (the `accounts` table), not a company
-- provision code. Each install mints its own license via create_account and
-- registers itself here, so the fleet shows VPN-XXXX-XXXX-XXXX per device instead
-- of a shared CORP-<company> account. Idempotent.

-- A license-registered device has no company, so company_id must be nullable.
alter table public.fleet_devices alter column company_id drop not null;

-- ── RPC: register_exit_node ───────────────────────────────────────────────
-- Verifies the VPN-XXXX license exists, upserts the device row under it, and
-- mints a per-device token (only the sha256 hash is stored). Returns the token
-- ONCE. Auth for subsequent heartbeats stays the same (device_id + token hash).
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

  v_token := encode(gen_random_bytes(32), 'hex');   -- 64 hex chars

  insert into fleet_devices (account_id, device_id, device_name, device_type, device_token)
  values (
    v_acc.id, trim(p_device_id), p_device_name,
    coalesce(nullif(trim(p_device_type), ''), 'other'),
    encode(digest(v_token, 'sha256'), 'hex')
  )
  on conflict (device_id) do update set
    account_id   = excluded.account_id,
    company_id   = null,                 -- supersede any legacy CORP-/company link
    device_name  = excluded.device_name,
    device_type  = excluded.device_type,
    device_token = excluded.device_token,
    enrolled_at  = now();

  return json_build_object(
    'success',      true,
    'account_id',   v_acc.id,
    'device_token', v_token
  );
end;
$$;

grant execute on function public.register_exit_node(text, text, text, text) to anon, authenticated;
