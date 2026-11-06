# Shares floor in, assets ceil out

> **Trust:** private educational lab (Tier B)  
> **Quest:** 068 — single-sided FT vault  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach vault **share mint (floor)** and **burn (ceil)** so rounding favors the pool, not the last actor.

**Real code:** `npm test`. **Not** a live custody contract, **not** an `on_notify` deposit, **not** wasm.

## What you can learn

- Why the first deposit is 1:1 only when both assets and shares are zero.
- Why a later deposit uses `floor(deposit * shares / assets)` after yield.
- Why a partial withdraw uses ceiling division so leftover dust stays in the vault.
- Why an empty vault with assets and no shares (or the reverse) is refused.
- Why refusing a zero-share mint is only a partial answer to first-depositor inflation.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `invariants/vault.ts` | `sharesForDeposit`, `assetsForBurn`, `deposit`, `withdraw` |
| `invariants/vault.test.ts` | Executed claims (17 tests) |
| `EDUCATION.md` | Which way each division rounds; donation surface |
| `SECURITY.md` | Inflation notes; donation demonstrated, not fixed |

## What is true (executed)

| Rule | Result |
| --- | --- |
| First deposit `1000n` | minted `1000`, assets `1000`, shares `1000` |
| After assets are set to `1500` with shares still `1000`, deposit quote for `100n` | `floor(100 * 1000 / 1500) = 66` shares |
| Later deposit after yield | vault mutates: assets `1600`, shares `1066` |
| Zero deposit | refused |
| Deposit that would mint 0 shares | refused; vault unchanged |
| Assets without shares, or shares without assets | `inconsistent empty vault` |
| Full withdraw of `1000` shares after a `1000` deposit | `1000` assets out; vault empty |
| Vault `{ assets: 1000, shares: 3 }`, burn `1` share | `ceil(1000 / 3) = 334` assets |
| Three sequential 1-share burns from `1000/3` | sum out `1000`; vault empty |
| Burn more shares than exist / zero burn / no shares | refused |
| Amounts above `MAX_AMOUNT` or negative | refused |
| Donation after 1-share open (assets → `1e6`) | victim deposit of `100` refused; attacker can still burn the sole share for the pot |

## The rule, in order

Deposit:

```text
if assets == 0 and shares == 0: minted = deposit
else: minted = floor(deposit * shares / assets)
```

A minted amount of zero is refused (`deposit too small to mint shares`). One side zero and the other side non-zero throws `inconsistent empty vault`.

Withdraw:

```text
assetsOut = ceil(sharesBurn * assets / totalShares)
          = (sharesBurn * assets + shares - 1) / shares
```

`sharesBurn` must be positive and not above total shares. `assetsOut` must not exceed vault assets.

```ts
import { deposit, emptyVault, sharesForDeposit, assetsForBurn } from "./invariants/vault.ts";

const first = deposit(emptyVault(), 1000n);
const grown = { assets: 1500n, shares: first.vault.shares };
sharesForDeposit(grown, 100n); // 66n
assetsForBurn({ assets: 1000n, shares: 3n }, 1n); // 334n
```

## Edge cases

- Amounts must be non-negative `bigint` at or below `MAX_AMOUNT` (`2^62 - 1`).
- Yield in the test is a direct write to `assets`. Nothing here accrues interest.
- Ceiling withdraw can pay more than a floor quote would. That is intentional: the vault keeps the residual only after the ceiling is paid.
- This file has no depositor list. Shares are a single total.
- Refusing a zero-share mint is **not** a virtual-offset defense. See [SECURITY.md](SECURITY.md).

## Best practice and the opposite

**Do** floor the shares minted and ceil the assets paid out.  
**Do** refuse a vault that has assets and zero shares.

**Do not** treat a passing `deposit` as token custody. No transfer is received.  
**Do not** skip a first-depositor review in production. This lab does not add a virtual offset. See [SECURITY.md](SECURITY.md).

## Live path, not shipped

```
deposit / withdraw math          [tested]
    → token on_notify custody        [not in this repo]
    → per-account share ledger       [not in this repo]
    → donation / inflation defense   [demonstrated surface only]
```

## Related

- `px-stake-nft-custodial-masterchef` — acc-per-share, a different reward rule
- Vault index: `px-contract-examples-vault`

## Run

```bash
npm test
```

MIT — Pixel Journey
