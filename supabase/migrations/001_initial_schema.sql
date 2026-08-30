-- ─────────────────────────────────────────────────────
-- 001_initial_schema.sql — Otunity Labs Portal · Fase 1
-- Aplicado el 2026-08-30 vía MCP (project: mnhwjrbzmowvsuigcnen)
-- ─────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- ┌──────────────────────────────────────────┐
-- │ 1. owners  (espejo 1:1 de auth.users)    │
-- └──────────────────────────────────────────┘
create table public.owners (
  id         uuid        primary key references auth.users(id) on delete cascade,
  email      text        not null,
  nombre     text        not null default '',
  created_at timestamptz not null default now()
);

alter table public.owners enable row level security;

create policy "owners: ver propia fila"
  on public.owners for select
  using (auth.uid() = id);

create policy "owners: editar propia fila"
  on public.owners for update
  using (auth.uid() = id);

create or replace function public.handle_new_owner()
returns trigger language plpgsql security definer as $$
begin
  insert into public.owners (id, email, nombre)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_owner();

-- ┌──────────────────────────────────────────┐
-- │ 2. solutions  (catálogo de productos)    │
-- └──────────────────────────────────────────┘
create table public.solutions (
  id              uuid        primary key default uuid_generate_v4(),
  nombre          text        not null,
  descripcion     text        not null,
  precio_mensual  integer     not null,
  categoria       text        not null,
  icono           text        not null,
  activa          boolean     not null default true,
  destacada       boolean     not null default false,
  created_at      timestamptz not null default now()
);

alter table public.solutions enable row level security;

create policy "solutions: lectura para autenticados"
  on public.solutions for select
  using (auth.role() = 'authenticated');

-- ┌──────────────────────────────────────────┐
-- │ 3. subscriptions                         │
-- └──────────────────────────────────────────┘
create table public.subscriptions (
  id             uuid        primary key default uuid_generate_v4(),
  owner_id       uuid        not null references public.owners(id) on delete cascade,
  solution_id    uuid        not null references public.solutions(id),
  estado         text        not null default 'active'
                               check (estado in ('active', 'canceled', 'trialing')),
  stripe_sub_id  text,
  created_at     timestamptz not null default now(),
  unique (owner_id, solution_id)
);

alter table public.subscriptions enable row level security;

create policy "subscriptions: ver las propias"
  on public.subscriptions for select
  using (auth.uid() = owner_id);

create policy "subscriptions: crear las propias"
  on public.subscriptions for insert
  with check (auth.uid() = owner_id);

create policy "subscriptions: actualizar las propias"
  on public.subscriptions for update
  using (auth.uid() = owner_id);

-- ┌──────────────────────────────────────────┐
-- │ 4. app_links  (puente futuro — vacía)    │
-- └──────────────────────────────────────────┘
create table public.app_links (
  id           uuid        primary key default uuid_generate_v4(),
  owner_id     uuid        not null references public.owners(id) on delete cascade,
  solution_id  uuid        not null references public.solutions(id),
  app_user_id  text        not null,
  created_at   timestamptz not null default now()
);

alter table public.app_links enable row level security;

create policy "app_links: ver los propios"
  on public.app_links for select
  using (auth.uid() = owner_id);

-- ┌──────────────────────────────────────────┐
-- │ Semilla — 6 soluciones (íconos Lucide)   │
-- └──────────────────────────────────────────┘
insert into public.solutions
  (nombre, descripcion, precio_mensual, categoria, icono, activa, destacada)
values
  ('JChat',      'Red social y chat en tiempo real para tu negocio local. Conecta con clientes, gestiona tu menú y acepta pedidos.',        9900, 'Comunidad',    'map-pin',   true, true),
  ('AI Studio',  'Herramientas de inteligencia artificial para crear contenido, automatizar respuestas y analizar tendencias.',             5900, 'Productividad', 'sparkles',  true, false),
  ('CRM',        'Gestiona tus clientes, registra interacciones y convierte prospectos en clientes leales con seguimiento automático.',     4900, 'Ventas',        'users',     true, false),
  ('Books',      'Contabilidad simplificada: ingresos, gastos, reportes y facturación diseñados para pequeños negocios.',                  3900, 'Finanzas',      'calculator', true, false),
  ('Inventory',  'Control de inventario en tiempo real. Alertas de stock bajo, órdenes de compra y reportes de movimientos.',              2900, 'Operaciones',   'box',       true, false),
  ('Sites',      'Crea tu sitio web profesional en minutos. Plantillas para negocios locales, sin código.',                                1900, 'Marketing',     'globe',     true, false);
