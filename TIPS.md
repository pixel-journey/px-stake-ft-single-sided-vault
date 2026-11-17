# Tips — single-sided vault share math

## Rounding

- **Floor on deposit** so a depositor cannot round shares up against the pool.
- **Ceiling on burn** so an exit cannot farm truncation dust. The leaver can receive more than a pure floor (1 of 3 shares of 1000 assets → **334**). That is intentional here.
- Three 1-share burns of a 3-share / 1000-asset vault must sum to 1000. If they do not, the formula is wrong.

## Product

| Topic | Guidance |
| --- | --- |
| Per-account book | The pure vault only has totals. A desk must track who owns shares. |
| First depositor | 1:1 open is convenient and dangerous. A virtual offset (dead shares) is a common defense this lab does **not** implement. |
| Donation | Assets up, shares unchanged, next mint uses the new ratio. A mint of 0 shares is refused (inflation victim). |
| Custody | Credit only on the real token `on_notify`: contract, symbol, precision, `to == self`. |
| Shares | An issued share token or a row per account. Either must match `vault.shares`. |

## Common mistakes

1. Rounding both ways with floor (exits leak dust to the last holder, or the opposite, depending on order).
2. Minting shares for a donation that should only raise the ratio.
3. Calling this an NFT chef. Emissions are [masterchef](https://github.com/pixel-journey/px-stake-nft-custodial-masterchef). Non-custodial scan is [scanner](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner).
4. Using JavaScript `number` near `2^62`.

## Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| Dead shares on first deposit | Changes the 1000 → 1000 test |
| Withdrawal fee | Another bps floor; document who receives it |
| Pause deposits | [pausable](https://github.com/pixel-journey/px-token-pausable-emergency-guard) |

> Floor in protects existing LPs from generous mints. Ceil out avoids a floor-exit dust game. Neither replaces custody or a first-depositor defense.

Related: [token ledger](https://github.com/pixel-journey/px-token-balance-ledger) · [invariant kit](https://github.com/pixel-journey/px-invariant-kit) · [dust](https://github.com/pixel-journey/px-token-dust-truncation-visualizer)
