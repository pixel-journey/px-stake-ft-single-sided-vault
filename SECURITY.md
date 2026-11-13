# Security notes — FT vault

| Mitigated | Behavior |
| --- | --- |
| Zero deposit/burn | refused |
| Burn > total shares | refused |
| Mint 0 shares | refused |
| Book over-burn | composition refuses |

Production: custody via token transfer/`on_notify`, share token or table, reentrancy, pause path.
