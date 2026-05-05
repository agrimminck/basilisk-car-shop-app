# Basilisk Car Shop App

**Production:** https://basilisk-car-shop-app.vercel.app/pos

Aplicación POS y gestión para taller mecánico con integración Transbank.

## Estructura

```
apps/
  web/        — Next.js 15 frontend (interfaz POS)
  bridge/     — Node.js API local para comunicación con máquina Transbank
packages/
  types/      — Tipos TypeScript compartidos
supabase/
  migrations/ — Schema SQL + seed data
```

## Stack

- **Frontend**: Next.js 15, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, Zustand
- **Bridge**: Node.js, Express, transbank-pos-sdk
- **DB**: PostgreSQL (Supabase)

## Requisitos

- Node.js 20+
- pnpm 10+
- Máquina Transbank POS Integrado (Verifone/Ingenico) + drivers USB
- Cuenta Supabase (para DB productiva)

## Instalación

```bash
pnpm install
```

## Variables de entorno

Copiar y completar:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Ver `apps/web/.env.example` para lista completa.

## Desarrollo

```bash
# Terminal 1 — Bridge Transbank
pnpm --filter @basilisk/bridge dev

# Terminal 2 — Frontend web
pnpm --filter @basilisk/web dev
```

O simultáneo con Turbo:

```bash
pnpm dev
```

## DB

```bash
# Aplicar schema y seed (requiere DATABASE_URL)
pnpm db:reset
```

## Transbank

1. Afiliar comercio en https://publico.transbank.cl/
2. Solicitar máquina POS Fijo Integrado
3. Instalar drivers (Verifone/Ingenico)
4. Conectar máquina vía USB
5. Bridge auto-detecta puerto con `autoconnect()`

## Licencia

Privado — Basilisk Ecosystem
