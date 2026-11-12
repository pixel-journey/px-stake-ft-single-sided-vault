# Official sources

There is no single WAX "vault standard." Share math in this lab follows the usual **floor on mint / ceil on burn** pattern used by many AMM and single-sided vault designs. Token movement on WAX still goes through the token contract you choose.

| Source | Use |
| --- | --- |
| [eosio.token reference](https://github.com/eosio/eosio.contracts) | Transfer / balance primitives underlying custody |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Actions, `on_notify`, permissions |
| [WAX API reference](https://docs.wax.io/build/api-reference/) | Chain reads |

This lab has **no** `on_notify` and **no** per-account share ledger. First-depositor inflation is **demonstrated**, not fixed (see SECURITY.md).

## Related org labs

| Repo | Focus |
| --- | --- |
| [px-stake-nft-custodial-masterchef](https://github.com/pixel-journey/px-stake-nft-custodial-masterchef) | acc-per-share rewards |
| [px-stake-nft-noncustodial-scanner](https://github.com/pixel-journey/px-stake-nft-noncustodial-scanner) | Stake without moving the NFT |
| [px-token-balance-ledger](https://github.com/pixel-journey/px-token-balance-ledger) | Conservation ledger under the token |
| [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit) | Shared math / quantity gates |
