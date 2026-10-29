# Education

Vaults convert assets ↔ shares. Integer division always truncates toward zero for plain `/`.

| Direction | Rounding in this lab | Why |
|-----------|----------------------|-----|
| Deposit → shares | **floor** | Depositor cannot mint fractional extra shares |
| Shares → assets | **ceil** | Withdrawal pays enough units; residual dust stays in the vault |

First depositor is 1:1 when the vault is empty (both assets and shares zero).

Empty-vault inconsistency (assets>0 with shares=0 or the reverse) is refused.
