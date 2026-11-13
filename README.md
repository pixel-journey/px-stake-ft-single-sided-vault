# Shares floor in, assets ceil out

> **Domain:** single-sided FT vault  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** Vault **share mint (floor)** and **burn (ceil)** so rounding favors the pool, not the last actor.

**Code under test:** `npm test` (unit + multi-user composition). Pure share math — not a live custody contract, not an `on_notify` deposit, not wasm.

Token primitives on WAX still depend on the token contract you use — [eosio.token](https://github.com/eosio/eosio.contracts), [docs.wax.io](https://docs.wax.io/).

## Composition

The pure vault tracks only **totals**. Production must also keep a **per-account share book**. `vault.composition.test.ts` pairs deposit/withdraw with that book: book sum always equals `vault.shares`, accounts cannot burn more than they hold, and full exit conserves assets.

## What is true (executed)

| Rule | Result |
| --- | --- |
| First deposit `1000n` | minted `1000` |
| After assets `1500` / shares `1000`, deposit `100n` | floor `66` shares |
| Zero deposit / zero-share mint | refused |
| Burn `1` share from `1000/3` | ceil `334` |
| Three sequential 1-share burns | sum out `1000` |
| Multi-user book | sum(book) === vault.shares |

## Related

- [px-stake-nft-custodial-masterchef](https://github.com/pixel-journey/px-stake-nft-custodial-masterchef)
- [px-stake-nft-noncustodial-scanner](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner)
- [px-token-balance-ledger](https://github.com/pixel-journey/px-token-balance-ledger)

```bash
npm test
```

MIT — Pixel Journey
