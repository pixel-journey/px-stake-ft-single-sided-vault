# Shares floor in, assets ceil out

> **Trust:** private educational lab (Tier B)  
> **Domain:** single-sided FT vault  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach vault **share mint (floor)** and **burn (ceil)** so rounding favors the pool, not the last actor.

**Real code:** `npm test` (17 tests). **Not** a live custody contract, **not** an `on_notify` deposit, **not** wasm.

Token primitives on WAX still depend on the token contract you use — see [eosio.token reference](https://github.com/eosio/eosio.contracts) and [docs.wax.io](https://docs.wax.io/).

## What is true (executed)

| Rule | Result |
| --- | --- |
| First deposit `1000n` | minted `1000`, assets `1000`, shares `1000` |
| After assets `1500` / shares `1000`, deposit `100n` | `floor(100 * 1000 / 1500) = 66` shares |
| Zero deposit / zero-share mint | refused |
| Assets without shares (or reverse) | `inconsistent empty vault` |
| Burn `1` share from `1000/3` | `ceil = 334` assets |
| Three sequential 1-share burns | sum out `1000`; vault empty |
| Donation after 1-share open | victim small deposit refused; attacker can still take the pot |

## The rule

```text
mint:  floor(deposit * shares / assets)   (1:1 when both zero)
burn:  ceil(sharesBurn * assets / totalShares)
```

## Live path, not shipped

```
deposit / withdraw math          [tested]
    → token on_notify custody        [not in this repo]
    → per-account share ledger       [not in this repo]
    → donation / inflation defense   [demonstrated surface only]
```

## Related

- [px-stake-nft-custodial-masterchef](https://github.com/pixel-journey/px-stake-nft-custodial-masterchef)
- [px-stake-nft-noncustodial-scanner](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner)
- [px-token-balance-ledger](https://github.com/pixel-journey/px-token-balance-ledger)

## Run

```bash
npm test
```

MIT — Pixel Journey
