# LoadoutForge 088

LoadoutForge is the Nightshift build 088 Solana game-asset app. It lets a connected wallet compose an operator archetype, equip a four-slot loadout, calculate synergy and readiness, preview generated game metadata/artwork, and mint a devnet MPL Core asset.

Live target: https://loadoutforge088.colmena.dev

## Commands

```bash
bun install
bun run lint
bun run check-types
bun run build
bun run proof:mint
bun run start
```

`bun run proof:mint` uses `LOADOUTFORGE_DEVNET_SIGNER_KEYPAIR` or defaults to `/home/obrera/keys/obrE1BHvP4EX8PkxPxAJxYfQkgfgCmXyJadQA3yBb7G.json`.

## Runtime

The Bun server listens on `PORT` with default `9876` and serves:

- `/health`
- `/api/health`
- `/api/bootstrap`
- `/metadata/{64hex}.json`
- `/metadata/{64hex}.svg`
- the Vite `dist` app

## Structure

- `src/loadoutforge/data-access`: domain data, metadata generation, local proof storage, and wallet-signed MPL Core minting
- `src/loadoutforge/feature`: app orchestration and mint-station workflow
- `src/loadoutforge/ui`: presentational LoadoutForge panels
