# Basilisk Car Shop App — Overview

## Estado actual

**En desarrollo.** UI deployada en Vercel para testing/desarrollo (`basilisk-car-shop-app.vercel.app`). NO en producción comercial con clientes reales.

**Transbank POS Integrado: NO integrado.** Está en el roadmap. El bridge Node.js + transbank-pos-sdk existe en el código pero nunca fue testeado con hardware físico real (máquina Verifone/Ingenico). No se puede afirmar que Transbank esté integrado — es código de arquitectura preparado, nada más.

---

## Propósito

POS y gestión integral para taller mecánico chileno. Venta de repuestos, servicios y combos. Integración con máquinas Transbank para pagos con tarjeta en tienda física.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16.2.4 App Router, React 19, TypeScript |
| Estilos | Tailwind CSS v3, dark mode custom, glassmorphism, neon glows |
| Componentes | shadcn/ui-style manual (Button, Card, Input, Badge, Dialog, Sheet, Tabs, ScrollArea, Separator) |
| Animaciones | Framer Motion |
| Gráficos | Recharts |
| Estado | Zustand + persist localStorage |
| DB | PostgreSQL via **Neon** (schema `car_shop_app`) + Drizzle ORM |
| Tipos | @basilisk/types (workspace) |
| Bridge | Node.js + Express + transbank-pos-sdk |
| Monorepo | pnpm workspaces + Turbo |

## Arquitectura

```
Tablet/Desktop táctil (mostrador)
         │
    ┌────▼────┐
    │  Web    │  Next.js 16 → http://localhost:3002
    │  App    │
    └────┬────┘
         │ fetch /api/* (Next.js API Routes)
         ▼
    Neon (PostgreSQL serverless)
    schema: car_shop_app, ORM: Drizzle
         ▲
         │ HTTP localhost:8090
    ┌────┴────┐
    │ Bridge  │  Node.js + transbank-pos-sdk
    │ (local) │  Puerto serial → Máquina Transbank
    └─────────┘
```

Bridge corre en misma PC del mostrador. Frontend accesible desde tablet o navegador local. Si bridge caído, app funciona para todo excepto pagos con tarjeta.

## Estructura

```
basilisk-car-shop-app/
├── apps/
│   ├── web/                # Next.js 16 frontend
│   │   ├── src/app/        # Rutas: /pos, /dashboard, /inventory, /customers, /sales, /services, /settings
│   │   ├── src/app/api/    # products/route.ts (GET), sales/route.ts (GET+POST)
│   │   ├── src/components/ # UI base + POS components
│   │   ├── src/hooks/      # use-pos-store.ts (Zustand cart)
│   │   ├── src/lib/        # api/bridge.ts, api/supabase.ts (API fetchers), db.ts, schema.ts (Drizzle), format.ts, utils.ts
│   │   └── ...
│   └── bridge/             # Express API local
│       └── src/index.ts    # Endpoints /api/pos/*
├── packages/
│   └── types/              # Legacy Supabase-style type definitions (snapshot; not used by web app — uses Drizzle inferred types)
├── supabase/migrations/    # SQL schema + seed (referencia; app usa Drizzle, no supabase-cli)
│   ├── 0001_schema.sql
│   └── 0002_seed.sql
└── README.md
```

## Modelo de datos (resumen)

Tablas clave: branches, categories, customers, vehicles, suppliers, products, product_variants, inventory, services, bundles, bundle_items, sales, sale_lines, payments, invoices.

Multi-sucursal ready (branch_id en sales e inventory). UUIDs en todas las PK.

## Integración Transbank

- Producto: POS Integrado (máquina física Verifone/Ingenico)
- SDK: `transbank-pos-sdk` (Node.js)
- Flujo: `autoconnect()` → `loadKeys()` → `sale(amount, ticket)` → recibir respuesta → guardar en DB
- Bridge expone: POST /api/pos/connect, /api/pos/sale, /api/pos/refund, /api/pos/close-day

## Pantallas

| Ruta | Propósito |
|------|-----------|
| /pos | Venta principal. Grid productos + carrito fijo + checkout |
| /dashboard | KPIs, gráficos ventas, stock bajo, servicios en curso |
| /inventory | Gestión productos, servicios, combos. Tablas + formularios |
| /customers | Clientes y vehículos. RUT chileno, patentes |
| /sales | Historial ventas. Filtros, detalle, estadísticas |
| /services | Grid servicios de taller |
| /settings | Config Transbank, general, impresión |

## Flujo de venta

1. Vendedor tap en producto/servicio → agrega a carrito (Zustand)
2. Ajusta cantidades en carrito
3. Tap "Pagar" → modal métodos de pago
4. Efectivo/Transferencia: marca como pagado
5. Débito/Crédito: llama a bridge → POS físico procesa → recibe autorización → marca pagado
6. Guarda venta en Supabase

## Diseño visual

- **Tema**: Dark mode vibrante con estilo "game-like". Fondo de taller mecánico real (Unsplash) con overlay oscuro
- **Paleta**: background `#080a10`, primary cyan `#38bdf8`, accent naranja `#fb923c`, success `#34d399`, danger `#f87171`
- **Glassmorphism**: cards y paneles con `backdrop-blur`, bordes translúcidos `white/10`, sombras sutiles
- **Neon glows**: acentos cyan/naranja con text-shadow y box-shadow en elementos activos
- **Imágenes**: 15 imágenes profesionales generadas con IA (Pollinations) para cada producto/servicio del POS. Guardadas en `apps/web/public/images/products/`. Formatos JPEG 400×300, fondo oscuro, estilo taller mecánico. Fallback a iconos Lucide + gradient si `imageUrl` ausente.
- **Scrollbar custom**: estilo fino con thumb cyan translúcido
- **Tipografía**: Inter, pesos bold en precios y títulos

## Decisiones

- Dark mode por defecto: reduce fatiga en pantallas de mostrador 8+ horas
- Split-view en /pos: grid izquierdo + carrito derecho siempre visible (patrón Square/Shopify POS)
- Bridge separado del frontend: permite usar tablet iPad/Android sin depender de Electron
- Monorepo pnpm: consistencia con otros proyectos basilisk
- Mock data inline: facilita desarrollo sin Supabase configurado; reemplazo por llamadas reales es trivial
- Glassmorphism en lugar de cards sólidas: sensación moderna y premium, reduce sensación de app "corporativa aburrida"

## Variables de entorno

```bash
# apps/web/.env.local
DATABASE_URL=postgresql://neondb_owner:<password>@ep-muddy-forest-acsgvbxh.sa-east-1.aws.neon.tech/neondb?schema=car_shop_app&sslmode=require
```
Password en `basilisk-infra/.env` → `NEON_PASSWORD`.

## Scripts

```bash
pnpm install
pnpm dev              # Turbo: web + bridge
pnpm build            # Build producción
pnpm db:reset         # Schema + seed (requiere DATABASE_URL)
```

## Puertos de desarrollo

| Servicio | Puerto | Nota |
|----------|--------|------|
| Web (Next.js) | 3002 | `apps/web/package.json` → `next dev -p 3002 -H 0.0.0.0` |
| Bridge (Express) | 8090 | `apps/bridge/src/index.ts` → `process.env.PORT \|\| 8090` |

Regla cross-repo basilisk: cada proyecto Next.js usa puerto propio para evitar colisiones locales. Ver `basilisk-infra/claude-docs/ports.md` para mapa completo.

## Fixes recientes

- **2026-05-01** — Layout `/pos`: panel derecho (carrito) no ocupaba altura completa. Fix: wrapper cambiado a `md:flex md:flex-col`, panel izquierdo añadió `h-full`. Archivo: `apps/web/src/app/pos/page.tsx`.
- **2026-05-01** — Margen exterior en `/pos`: app tenía `m-4` y `rounded-2xl` dejando borde oscuro alrededor. Fix: eliminado `m-4`, cambiado `h-[calc(100vh-2rem)]` a `h-screen`, eliminado `rounded-2xl`. Archivo: `apps/web/src/app/pos/page.tsx`.
- **2026-05-01** — Imágenes mock rotas: URLs Unsplash para productos devolvían 404, productos parecían vacíos. Fix: reemplazadas por iconos Lucide representativos por categoría con fondos gradient. Archivos: `mock-data.ts`, `product-card.tsx`.
- **2026-05-05** — Imágenes profesionales por item: generadas 15 imágenes IA locales para cada producto/servicio del POS. Agregado campo `imageUrl` a `mock-data.ts`. Imágenes en `apps/web/public/images/products/`.
- **2026-05-01** — Acceso LAN: `next dev` solo escuchaba en localhost. Fix: añadido `-H 0.0.0.0` al script `dev` en `apps/web/package.json`.

## Migración Neon (2026-05-01)

Stack DB migrado de Supabase mock → Drizzle + Neon.

**Archivos eliminados:**
- `apps/web/src/lib/supabase/client.ts`

**Archivos creados:**
- `apps/web/src/lib/db.ts` — Drizzle + Neon HTTP client
- `apps/web/src/lib/schema.ts` — Drizzle schema completo (branches, categories, products, variants, inventory, services, bundles, sales)
- `apps/web/src/app/api/products/route.ts` — GET todas las entidades en paralelo
- `apps/web/src/app/api/sales/route.ts` — GET + POST ventas

**Archivos modificados:**
- `apps/web/src/lib/api/supabase.ts` — funciones ahora hacen fetch a `/api/products` y `/api/sales` (misma firma, sin breaking changes)
- `apps/web/package.json` — removido `@supabase/supabase-js`, agregado `drizzle-orm` + `@neondatabase/serverless`
- `apps/web/.env.example` — usa `DATABASE_URL` (ver abajo)

### ⚠️ Acción obligatoria antes de correr

```bash
cd apps/web
pnpm install  # instala drizzle-orm, @neondatabase/serverless
```

Crear `apps/web/.env.local`:
```
DATABASE_URL=postgresql://neondb_owner:<password>@ep-muddy-forest-acsgvbxh.sa-east-1.aws.neon.tech/neondb?schema=car_shop_app&sslmode=require
```
Password en `basilisk-infra/.env` → `NEON_PASSWORD`.

## Deploy Vercel (2026-05-01)

App deployada en producción: **https://basilisk-car-shop-app.vercel.app**

Configuración monorepo pnpm + Vercel:
- `rootDirectory=apps/web` seteado via Vercel API (no en vercel.json — campo no soportado ahí)
- `apps/web/vercel.json` — `installCommand: cd ../.. && pnpm install`, `buildCommand: cd ../.. && pnpm turbo run build --filter=@basilisk/web...`, `outputDirectory: .next`
- `turbo.json` raíz — `globalEnv: ["DATABASE_URL"]` obligatorio para que Turbo pase la var al build
- `DATABASE_URL` seteada como env var en Vercel dashboard/producción

**Pitfalls resueltos:**
- Sin `globalEnv` en turbo.json → Neon falla con "No database connection string" al collect page data
- Sin `rootDirectory=apps/web` en proyecto Vercel → "No Next.js version detected" (busca en root package.json)
- `vercel.json` debe ir en `apps/web/`, no en raíz del monorepo (Vercel lo lee desde rootDirectory)

Proyecto Vercel: `agrimmincks-projects/basilisk-car-shop-app` (`prj_jhgngSn47MQ1W7KyPcjC3zx3MLwH`)

## Deuda técnica conocida

- **Deps huérfanas**: verificado 2026-05-14 — `apps/web/package.json` ya NO contiene `@hookform/resolvers`, `react-hook-form`, `zod`, `@tanstack/react-query`. Limpio.
- **Tipo Transbank bridge operationId**: verificado 2026-05-14 — ambos lados (`apps/web/src/lib/api/bridge.ts` + `apps/bridge/src/index.ts`) usan `number`. Canonical: `number` (matches SDK signature `pos.refund(operationId: number)`). Mismatch resuelto.
- **`packages/types`**: tipos Supabase-style legacy. Web app usa tipos Drizzle inferred. Unificar o eliminar siguiente iteración.
- **`usePosStore` (Zustand) vs `useState` split** [FLAGGED medium — decisión arquitectural pendiente]: store Zustand existe con persist localStorage + lógica carrito completa, pero `apps/web/src/app/pos/page.tsx` usa `useState` local paralelo. Decidir antes de implementar: historial carrito, multi-sesión, persist resume tras reload. Opciones: (a) migrar todo a Zustand, (b) eliminar Zustand y declarar `useState` único, (c) split formal (Zustand solo persist, useState UI ephemeral). No tocado en polish — requiere input usuario.
- **Sales API atomic POST** [FIXED 2026-05-14]: `apps/web/src/app/api/sales/route.ts` POST ahora envuelve insert `sales` + bulk insert `sale_lines` + decrement `inventory` (UPDATE ... WHERE quantity >= qty, verifica 1 row affected) en `db.transaction`. Stock insuficiente → 409 + rollback completo. Driver migrado de `drizzle-orm/neon-http` → `drizzle-orm/neon-serverless` (Pool) porque neon-http no soporta multi-statement tx. Schema Drizzle extendido con `saleLines` (tabla SQL ya existía en `supabase/migrations/0001_schema.sql`). Specs cobertura: happy path + insufficient stock first/second line + validation 400 + db error propagation.
- **ESLint config** agregado `eslint.config.mjs` en `apps/web/` (2026-05-07 polish).
- **`as any` en product-card.tsx**: removido 2026-05-14, tipado via `BadgeProps["variant"]`.

## Polish 2026-05-14

- product-card.tsx: `stockVariant` tipado con `BadgeProps["variant"]`, eliminado `as any`.
- Docs sincronizado con código real (deps + operationId).
- Bridge code core NO tocado (hardware untested per regla).
- Flagged: Zustand/useState split (medium). Sales POST atomic inventory: FIXED 2026-05-14.

## Estado

MVP deployado en Vercel con DB real en Neon. App es POS local (no tienda pública). Pendientes:
- Auth/usuarios (no implementado aún)
- Facturación electrónica SII
- Impresión de boletas
- Multi-sucursal (UI ya filtra por branch_id)
