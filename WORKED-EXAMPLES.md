# Worked examples — single-sided FT vault

Shares mint **floor** on deposit; assets out on burn use **ceiling**. Pure totals only — ownership is a separate book in composition tests.

## First deposit

Deposit 1000 into empty → minted **1000**, assets 1000, shares 1000 (1:1).

## Later deposit (floor)

After first 1000, inflate assets to 1500 (same shares 1000). Deposit 100:

| Field | Value |
| --- | --- |
| minted | **66** (`floor(100 * 1000 / 1500)`) |
| assets | 1600 |
| shares | 1066 |

Deposit 1 on that inflated vault → `deposit too small to mint shares` (no state change).

## Withdraw (ceiling)

Vault `{ assets: 1000, shares: 3 }`, burn 1 → assetsOut **334**, remaining assets 666, shares 2.

Three sequential 1-share burns pay **1000** total and clear the vault.

## First-depositor donation shape

Attacker deposits 1; assets jump to 1_000_000 with shares still 1. Victim deposit 100 floors to **0** and is refused. Attacker burning 1 would take **1_000_000**. Lab refuses zero mint; it does **not** add a virtual offset (document that product gap).

## Composition desk

Alice 1000 then inflation then Bob 100 → alice 1000 shares, bob 66, sumBook === vault.shares.

Alice cannot debit more shares than her book. Full alice+bob exit of 900+100 deposits pays **1000** and empties vault and book.

## Refusals

Zero deposit/burn; burn exceeds total shares; assets without shares / shares without assets (inconsistent empty); amount > MAX_AMOUNT or negative.
