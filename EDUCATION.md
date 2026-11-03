# Education — vault shares

> **Rung:** `npm test` passes. Nothing custodies a token. Yield in the test is a direct write to `assets`.  
> **The test is the rule.**

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Mint 1:1 on an empty vault, then floor a later deposit |
| Intermediate | Compute the ceiling withdraw and say who the rounding favors |
| Masterclass | Describe the first-depositor inflation attack this lab only partly blocks |

---

## Beginner — one scene

An empty vault receives 1000 units. It mints 1000 shares. Assets and shares are both 1000.

Later the assets are 1500 while shares are still 1000. That is the test's stand-in for yield. A new deposit of 100 does not mint 100 shares.

```text
floor(100 * 1000 / 1500) = floor(66.666…) = 66
```

The depositor gets fewer shares than a 1:1 quote. The extra fraction stays in the vault, which raises the value of existing shares. Rounding on the way in favors the pool.

### Words

| Word | Rule in this lab |
| --- | --- |
| Empty | Both assets and shares are 0. Mixed zeros are refused |
| Mint | `floor(deposit * shares / assets)` after the first deposit |
| Burn quote | `ceil(sharesBurn * assets / totalShares)` |
| Ceiling trick | `(a + shares - 1) / shares` for positive integers |

### Predict, then run

```bash
npm test
```

1. Deposit 0 throws `deposit must be positive`.
2. Withdraw all 1000 shares after a 1000 deposit returns 1000 assets and leaves the vault at 0 / 0.
3. Vault `{ assets: 1000n, shares: 3n }`, burn 1 share, assets out are 334, not 333.

---

## Intermediate — why 334

```text
ceil(1000 / 3) = ceil(333.333…) = 334
code: (1 * 1000 + 3 - 1) / 3 = 1002 / 3 = 334
```

A floor withdraw would pay 333 and keep 1. A ceiling withdraw pays 334. The comment in the source says this favors the vault. Read that carefully. Paying **more** assets to the burner gives the exiting user the leftover, and the remaining shareholders keep a slightly smaller pot. The security note in this repo calls the same choice "ceil burn cost" against a drain that uses floor. The tested number is 334. The policy sentence to remember: the lab does not use a plain truncating division on the way out, because a floor burn under-pays the leaver and can be aimed at leaving dust in a shape the attacker wants. If you teach "both edges favor the vault," say what you mean: mint uses floor so the depositor cannot round a share upward; burn uses ceil so the assets/share ratio cannot be walked down by a truncating exit. The 334 result is the executed fact.

Full exit of every share returns every asset in the 1000/1000 test, because `ceil` of the whole pot is the whole pot.

`deposit` refuses a quote of 0 shares (`deposit too small to mint shares`). `withdraw` refuses a burn above total shares, a zero burn, and a burn when shares are 0.

`sharesForDeposit` throws `inconsistent empty vault` if one side is 0 and the other is not. You cannot "mint against donated assets" through the empty branch. You also cannot pretend a drained share supply is a fresh 1:1 vault while assets remain.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Round shares up on deposit | Extra shares | floor | `later deposit rounds shares down` (66) |
| Floor the exit | Systematic leftover | ceil (334 not 333) | `partial burn uses ceiling assets` |
| Burn more shares than exist | Steal the pot | `exceeds total shares` | `refuses burn above total shares` |
| Zero deposit | Junk row | refused | `refuses zero deposit` |

---

## Masterclass — inflation, donations, and custody

### The first depositor

Empty vault mints 1:1. A classic attack is: deposit 1, donate a huge amount directly to the vault (assets jump, shares stay 1), then the next user's deposit floors to 0 shares and is rejected or, in a vault that still takes the assets, stolen. This lab rejects a 0-share mint, which stops the "mint zero and keep the assets" variant **if** deposit is the only way in. It does not add a virtual offset (dead shares minted to the zero address on the first deposit). The security file says that review is still required. Believe it.

The test simulates yield by assigning `assets: 1500n` with no deposit. That is the same shape as a donation. The lab will quote 66 shares. It will not notice that the 500 appeared without a transfer.

### Custody is the missing half

`deposit` increases a bigint. It does not see `on_notify`. A production vault:

- Accepts only the intended token contract, symbol, and precision.
- Ignores notifications where `get_first_receiver()` is wrong.
- Ignores `from == get_self()`.
- Credits shares only for the quantity that arrived, in the same inline context as the notify.
- Sends assets out on withdraw with an inline `transfer` whose name is a constant.
- Tracks shares per account. This lab has one total.

Until those exist, a passing `npm test` is a rounding spec, not a vault.

### Exercise

1. Empty vault, deposit 1, then set assets to `1000000n` without minting. `sharesForDeposit` of `100n`? `floor(100 * 1 / 1000000) = 0`, and `deposit` then throws `deposit too small to mint shares`. Derived. The tests do not run this donation.
2. Why is `{ assets: 0n, shares: 5n }` refused? (Inconsistent empty vault. The 1:1 branch requires both sides zero.)
3. What is not in the repo? (Token notify, per-user ledger, virtual offset.)

---

## What this course will not teach

- An interest rate
- That ceiling "always leaves dust in the vault" on a 1-of-3 burn (the leaver receives 334 of 1000)
- A compiled custody contract
