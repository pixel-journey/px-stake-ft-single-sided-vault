# Tips — single-sided vault share math

## Rounding

- **Floor on deposit** so a depositor cannot round their share count upward against the pool.
- **Ceiling on burn** so an exit cannot systematically leave attacker-shaped dust via truncating division.
- Remember: ceiling pays the **leaver** more (e.g. 334 of 1000 for 1 of 3 shares), which is intentional in this lab.

## Product design

| Topic | Guidance |
| --- | --- |
| Per-account book | Pure vault only has totals. Composition desk is the pattern for who owns shares. |
| First depositor | 1:1 open is convenient and dangerous. Virtual offset (dead shares) is a common defense this lab does **not** implement. |
| Donation / yield | Direct asset increase without mint is the same shape as inflation. Quote carefully; refuse zero mint. |
| Custody | Real vaults credit only on correct token `on_notify` (contract, symbol, precision, to=self). |
| Share token vs table | Either an issued share FT or a row per account; both need conservation with vault.shares. |

## Pairing with other labs

- [token balance ledger](https://github.com/pixel-journey/px-token-balance-ledger) — conservation under the token itself
- [masterchef](https://github.com/pixel-journey/px-stake-nft-custodial-masterchef) — emission, not share mint math
- [invariant kit](https://github.com/pixel-journey/px-invariant-kit) — safe uint math and quantity gates
- [non-custodial NFT scanner](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner) — stake without moving the asset

## Teaching phrase

> Floor in protects existing LPs from generous mints; ceil out avoids a floor-exit dust game. Neither replaces custody or a first-depositor defense.
