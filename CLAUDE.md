# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`extol` is a small published npm library (ESM-only, Node >= 24, pnpm) that loads configuration values from environment variables, `.env` files, or `*_FILE`-pointed files, falling back to typed defaults. The entire library lives in `src/index.ts`.

## Commands

- `pnpm install` — install deps (pnpm version pinned via `packageManager` in package.json; Node version in `.nvmrc`)
- `pnpm build` — compile `src/` to `dist/` via `tsconfig.build.json`; `pnpm cb` cleans first
- `pnpm lint` / `pnpm lint:fix` — ESLint (flat config in `eslint.config.js`, includes unicorn, import-x, n, prettier plugins)
- `pnpm format` (writes) / `pnpm format:check` — Prettier over the whole repo (lockfile ignored)
- `pnpm ci` — lint + format check + build; this is what GitHub Actions runs, so run `pnpm format` before committing
- `pnpm example:simple | example:simpleobject | example:decorator | example:decoratorprefix` — run examples with `tsx` against `examples/*.env`

There is no test suite; the examples serve as the manual verification path.

## Architecture

Public API exported from `src/index.ts`:

- `load(key, default, options)` — core resolver. Env var name = `options.envVarName` ?? `constantCase([envVarPrefix_]key)`. With `fileVariant`, `<NAME>_FILE` is checked first and the file's trimmed content used if it exists. With `json`, the value is `JSON.parse`d (falls back to the default with a warning on failure); otherwise the string is coerced by calling the **default value's constructor** (`Number`, `Boolean`, `String`, …) — so the default's type determines the result type.
- `loadObject(keysToDefaults, { envVarPrefix })` — `load` mapped over an object.
- `extol(default, options)` (default export) — legacy property decorator. It defines a lazy getter/setter on the **class prototype** that calls `load` on first access and caches the value in the closure. Because state lives in the decorator closure on the prototype, the value is effectively shared across all instances of the class. `readOnly` omits the setter.
- `extolPrefix(prefix)` — class decorator storing `__extolPrefix` on the prototype; property getters read it lazily at first access (class decorators run after property decorators, hence the lazy lookup).
- `WithExtolProps<T>` — base class whose `extolProps()` collects all decorated keys via the prototype's `__extolProps` list.

Important constraints:

- `dotenv.config()` runs as a side effect on import (intentional; honours `DOTENV_CONFIG_PATH`).
- Relies on TypeScript legacy decorators: `experimentalDecorators: true` and `useDefineForClassFields: false` in `tsconfig.json`. Changing the latter would make class field initialization shadow the prototype accessors and break decorators.
- Examples import from `../src/index.js` (NodeNext resolution requires `.js` extensions in relative imports).

## Release

CI (`.github/workflows/ci.yml`) runs `pnpm ci` on every push; on push to `main` it also builds and publishes to npm automatically (`pnpm publish:npmjs`). Bump `version` in package.json before merging to `main`.
