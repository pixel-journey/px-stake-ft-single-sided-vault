# Shares floor in, assets ceil out

> **Domain:** single-sided FT vault  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** Share **mint (floor)** and **burn (ceil)** so rounding favors the pool.

**Code under test:** `npm test` (unit + multi-user composition). Pure math — not live custody.

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | 1:1, floor mint, ceil burn, book |
| [TIPS.md](TIPS.md) | Per-account shares |
| [SECURITY.md](SECURITY.md) | Rounding and over-burn |
| [SOURCES.md](SOURCES.md) | eosio.token + related |

## What is true (executed)

| Rule | Result |
| --- | --- |
| First deposit 1000 | mint 1000 |
| 1500/1000 + deposit 100 | floor 66 shares |
| Burn with ceil | vault keeps residual |
| Multi-user book | sum(book) === shares |

```bash
npm test
```

MIT — Pixel Journey
