# Worked examples — single-sided vault

## Example A — first deposit 1:1

```text
deposit(empty, 1000n) → minted 1000, assets 1000, shares 1000
```

## Example B — floor on mint

Assets 1500, shares 1000; deposit 100 → `floor(100 * 1000 / 1500) = 66` shares.

## Example C — ceil on burn

Assets/shares ratio leaves dust: burn 1 share from `1000/3` style book → ceil assets out. Three sequential 1-share burns sum to full assets (composition).

## Example D — dust deposit

Deposit too small to mint ≥ 1 share → refused.

## Example E — multi-user book (composition)

Per-account share book: `sum(book) === vault.shares`; cannot burn more than held; full exit conserves.
