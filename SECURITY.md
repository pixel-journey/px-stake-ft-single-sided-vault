# Security notes

| Issue | Lab mitigation |
|-------|----------------|
| Share inflation on deposit | floor mint |
| Drain via floor withdraw | ceil burn cost |
| Empty vault desync | refused |
| Zero / oversized amounts | refused |
| Deposit that would mint 0 shares | refused (`deposit too small to mint shares`) |

## First-depositor donation (demonstrated, not fixed)

`npm test` includes a donation shape: deposit `1`, set assets to `1_000_000` without minting, then attempt a victim deposit of `100`. The quote is `0` shares and `deposit` throws. The attacker still holds the only share and can burn it for the whole pot.

Refusing a zero-share mint stops one failure mode **if deposit is the only entry path**. It is not a virtual offset. Production still needs token `on_notify`, custody accounting, per-account shares, and a real first-depositor defense.
