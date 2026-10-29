# px-stake-ft-single-sided-vault

> **Trust:** private educational lab (Tier B)  
> **Quest:** 068 — single-sided FT vault  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach vault **share mint (floor)** and **burn (ceil)** so rounding favors the pool, not the last actor.

**Real code:** `npm test`. **Not** a live custody contract or wasm.

---

## What is true (executed)

| Rule | Result |
|------|--------|
| First deposit | 1:1 shares |
| Later deposit after yield | floor shares |
| Burn | ceiling assets out |
| Zero deposit / over-burn | refused |

```bash
npm test
```

Neighbor: `px-stake-nft-custodial-masterchef` (acc-per-share).

## License

MIT — Pixel Journey
