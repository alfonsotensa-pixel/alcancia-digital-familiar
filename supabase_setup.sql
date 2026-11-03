-- ============================================================================
-- SmartPiggy Cloud - Script para Reutilizar un Proyecto Existente de Supabase
-- ============================================================================
-- Este script crea ÚNICAMENTE una tabla aislada (`public.smartpiggy_families`)
-- dentro de tu proyecto actual de Supabase sin modificar ni afectar ninguna
-- otra tabla o aplicación que ya tengas alojada en ese mismo proyecto.
--
-- Instrucciones:
-- 1. Entra a tu proyecto actual en https://supabase.com/dashboard
-- 2. Abre "SQL Editor" -> "New query", pega este bloque y pulsa "Run".
-- ============================================================================

create table if not exists public.smartpiggy_families (
  family_code text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

-- Habilitar Row Level Security (RLS) permitiendo sincronización por family_code
-- (La integridad de escritura de saldos está protegida criptográficamente por
-- la firma HMAC-SHA256 derivada con PBKDF2 de 210,000 iteraciones del PIN Parental)
alter table public.smartpiggy_families enable row level security;

drop policy if exists "smartpiggy_public_select" on public.smartpiggy_families;
create policy "smartpiggy_public_select"
  on public.smartpiggy_families
  for select
  to anon, authenticated
  using (true);

drop policy if exists "smartpiggy_public_insert" on public.smartpiggy_families;
create policy "smartpiggy_public_insert"
  on public.smartpiggy_families
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "smartpiggy_public_update" on public.smartpiggy_families;
create policy "smartpiggy_public_update"
  on public.smartpiggy_families
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- Activar emisión de eventos en Tiempo Real (WebSockets) para esta tabla
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'smartpiggy_families'
  ) then
    alter publication supabase_realtime add table public.smartpiggy_families;
  end if;
end $$;
