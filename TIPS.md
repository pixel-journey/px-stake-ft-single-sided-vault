# Tips — vault share math

- Floor in, ceil out → favors the pool, not the last actor.
- Track **per-account shares** in production; pure vault only tracks totals.
- Guard donation attacks / inflation if you allow direct asset transfers without minting.
- Pair with [masterchef](https://github.com/pixel-journey/px-stake-nft-custodial-masterchef) for emission, not for share math.
