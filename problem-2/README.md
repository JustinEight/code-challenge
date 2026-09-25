# Token Icons

This repository has two parts:

1. **Icon assets:** token and blockchain icons in `tokens/`, `blockchains/` and `demex/`. A GitHub Action syncs them to Google Cloud Storage so frontends can fetch them.
2. **Web app:** a React + Vite app for swapping coins, viewing a wallet and browsing the icons.

## Getting started

```bash
yarn install
yarn dev
```

| Script           | What it does                                               |
| ---------------- | ---------------------------------------------------------- |
| `yarn dev`       | Start the Vite dev server                                  |
| `yarn build`     | Type-check, then build to `dist/`                          |
| `yarn preview`   | Serve the production build                                 |
| `yarn typecheck` | Run TypeScript only                                        |
| `yarn test`      | Validate icon files (also runs as the git pre-commit hook) |

## Tech stack

- React 19 + TypeScript (strict)
- Vite
- React Router 7
- `@tanstack/react-virtual` for the icon grids
- Plain CSS with theme tokens (no CSS framework)
- `localStorage` for persistence (there is no backend)

## Features

| Route             | Module        | Description                                                                                     |
| ----------------- | ------------- | ----------------------------------------------------------------------------------------------- |
| `/swap` (default) | `swap`        | Swap a coin you own for another at USD prices from `https://interview.switcheo.com/prices.json` |
| `/tokens`         | `tokens`      | Virtualized, searchable grid of token icons                                                     |
| `/blockchains`    | `blockchains` | Virtualized, searchable grid of blockchain icons                                                |
| `/wallet`         | `wallet`      | Coins the current user owns (starts with 10,000 USDC)                                           |
| (header)          | `user`        | "Hello, user!" menu for the current user                                                        |

`/` and unknown paths redirect to `/swap`. The header search box only appears on routes whose nav tab has `keepSearch: true`.

## Project structure

```
src/
├── main.tsx                  App entry: renders the router
├── router/router.tsx         Combines every module's routes
├── layouts/RootLayout/       Header (tabs, search, theme, user menu) + <Outlet />
├── styles/global.css         Theme tokens (light-dark()), base styles
├── shared/                   Code used by more than one module
│   ├── components/           AssetIcon, AssetSelect, DropdownMenu, IconGrid, ImagePreloadGate,
│   │                         LoadingIndicator, NavTabs, SearchInput, Spinner, StatusMessage, ThemeSwitcher
│   ├── hooks/                useAsync, useDismiss, useElementLayout, usePreloadImages, useSearchQuery, useTheme
│   ├── types/                Shared types
│   └── utils/                formatAmount, formatUsd, decimalInput, jsonStorage, matchesQuery, ...
└── modules/
    ├── swap/
    ├── tokens/
    ├── blockchains/
    ├── wallet/
    └── user/
```

## Architecture

Every feature lives in its own module under `src/modules/<name>/`, with the same three layers:

```
modules/<name>/
├── infrastructure/
│   ├── dtos/            Raw data shapes as they come from the source      Wallet.dto.ts
│   ├── entities/        Domain models used by the rest of the app         Holding.entity.ts
│   ├── services/        The only code that touches a data source          WalletStorageService.ts (+ .types.ts)
│   ├── mappers/         DTO ↔ Entity conversion                           Wallet.mapper.ts
│   └── repositories/    Service + mapper → entities, behind an interface  IWalletRepository.ts, WalletRepository.ts (+ .types.ts)
├── use-cases/           Business logic, depends only on repository interfaces
└── presentation/
    ├── hooks/           Wire concrete repositories into use-cases, expose state to React
    ├── components/      UI for this module
    ├── pages/           Route-level components
    └── routes/          <name>.paths.ts (path constant) + <name>.routes.tsx (RouteObject[])
```

### Data flow

```
data source ──► Service ──► DTO ──► Mapper ──► Entity ──► Repository ──► Use-case ──► Hook ──► Component
 (API, localStorage,                                     (implements
  bundled files)                                          I…Repository)
```

### Layer rules

**Services** (`infrastructure/services/`)

- The only place that calls `fetch`, reads or writes `localStorage` (through `shared/utils/jsonStorage`), or uses `import.meta.glob`.
- Check the raw data's shape and return DTOs. In production these would call a real API; without one they use storage or bundled files.
- Plain classes with no interface. Options such as a storage key, URL or `fetch` go in `<Name>Service.types.ts`.

| Module      | Service                     | Source                    |
| ----------- | --------------------------- | ------------------------- |
| tokens      | `TokenAssetService`         | `tokens/*.{svg,png}`      |
| blockchains | `BlockchainAssetService`    | `blockchains/*.{svg,png}` |
| wallet      | `WalletStorageService`      | `localStorage["wallet"]`  |
| user        | `CurrentUserStorageService` | `localStorage["user"]`    |
| swap        | `PriceApiService`           | Switcheo prices API       |

**Mappers** (`infrastructure/mappers/`)

- `<Name>.mapper.ts` exports an object such as `WalletMapper = { toHoldings, toDto }` or `PriceMapper = { toEntities }`.
- Pure conversion only. For example, `PriceMapper` keeps the latest price per currency and averages duplicates that share a timestamp.

**Repositories** (`infrastructure/repositories/`)

- `I<Name>Repository.ts` is the contract that use-cases depend on.
- `<Name>Repository.ts` calls its service, maps the result, and returns entities. It builds its default service itself (`{ service = new WalletStorageService() }`), so callers only write `new WalletRepository()`.
- Caching lives here (e.g. `PriceRepository` fetches prices once).

**Use-cases** (`use-cases/`)

- Classes like `ExecuteSwapUseCase` and pure helpers like `validateSwap` or `swapMath`.
- Receive repository interfaces through the constructor and never import services or React.
- Validation shared by the UI and the use-case lives here, so the rules are checked again when a swap is confirmed.

**Presentation** (`presentation/`)

- Hooks create the concrete repositories and use-cases, e.g. `swapUseCases.ts`, `useWallet.ts`.
- Each module owns its route path (`*.paths.ts`) and routes (`*.routes.tsx`). Paths are kept in separate files so modules can link to each other without circular imports.

### Dependency rules

- `presentation` → `use-cases` → `infrastructure/repositories` (interfaces) → `mappers` / `services`.
- A module may use another module's repository interface or pure helper. For example, `swap` uses `IWalletRepository` and `createTokenIconLookup` from `tokens`.
- Anything needed by two or more modules moves to `src/shared/`.

## Persistence

All app state is stored in `localStorage`:

| Key      | Owner                                      | Content                                                       |
| -------- | ------------------------------------------ | ------------------------------------------------------------- |
| `wallet` | `WalletStorageService`                     | `{ holdings: [{ symbol, amount }] }`, seeded with 10,000 USDC |
| `user`   | `CurrentUserStorageService`                | `{ id, name }`, seeded with the guest "user"                  |
| `theme`  | `useTheme` + inline script in `index.html` | `light` / `dark` (missing means follow the system setting)    |

Clear these keys to reset the app.

## Conventions

- **Shared first.** Reuse `src/shared/` and extract there instead of duplicating code across modules.
- **Imports** use the `@/` alias for `src/`.
- **Styling:**
  - One `.css` file next to each component, with BEM-style class names (`swap-field__input--long`).
  - Colours only come from the theme tokens in `global.css` (`--bg`, `--card`, `--text`, `--muted`, `--border`, `--accent`, `--danger`, `--success`, `--on-accent`, `--icon-outline`). Each is defined with `light-dark()`.
- **Responsive:** every UI must work on phone, tablet and desktop.
  - Breakpoints: `1100px`, `560px`, `360px`.
  - Hover-only effects go inside `@media (hover: hover)`.
  - Animations respect `prefers-reduced-motion`.
- **Amounts** are shown exactly, rounded only past 18 decimal places (`formatAmount`, `decimalInput`).

## Adding a module

1. Create `src/modules/<name>/` with `infrastructure/{dtos,entities,services,mappers,repositories}`, `use-cases/` and `presentation/{hooks,components,pages,routes}`.
2. Write the service (data source → DTO), mapper (DTO → entity) and repository (interface + implementation).
3. Add use-cases that depend on the repository interface.
4. Wire them in a presentation hook, build the page, and export `<NAME>_PATH` and `<name>Routes`.
5. Register the routes in `src/router/router.tsx`, and add a tab or menu item in `RootLayout.tsx`.

## Icon contributions

Icons are named after the token's shorthand symbol, e.g. `tokens/BTC.svg`. Blockchain icons go in `blockchains/`.

Requirements (checked by `yarn test`):

1. Icons must be `SVG` or `PNG`.
2. Max file size is 100KB.
3. Icons must be square (width equals height).
4. PNG icons must be between 100px and 500px on each side.
