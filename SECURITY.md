# Security — FT vault rounding lab

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Zero deposit / zero burn | refused |
| Burn > total shares | refused |
| Mint that would be 0 shares | refused; vault unchanged |
| Inconsistent empty (assets XOR shares) | refused |
| Amount > MAX_AMOUNT / negative | refused |
| Account book over-burn | composition `insufficient account shares` |
| Full sequential exit | assets and shares return to 0; paid equals deposited principal in the 900+100 case |

## Demonstrated, not fixed

| Issue | What the test shows |
| --- | --- |
| First-depositor inflation | After 1 share and assets=1_000_000, victim floors to 0 and is refused; attacker can still burn the sole share for the pot |
| Yield as assignment | Tests set `assets` without a transfer — same shape as a silent donation |

This lab **does not** implement virtual offset, minimum liquidity lock, or proportional donation accounting.

## Production still needs

| Concern | Guidance |
| --- | --- |
| Token custody | `on_notify` only for intended contract/symbol/precision; ignore outbound and wrong receiver |
| Auth | Real `require_auth` on withdraw |
| Reentrancy | Update share book before external transfer out |
| Pause / cap | Emergency stop and max TVL if product requires |
| Share representation | Table or share token must stay consistent with `vault.shares` |
| First-depositor defense | Virtual shares, dead-share mint, or minimum deposit policy |

No wasm, no live token movement in this repository.
