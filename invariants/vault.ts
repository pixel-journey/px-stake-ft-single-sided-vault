/**
 * Single-sided FT vault (educational).
 * Shares round down on mint, up on burn — favors the vault on both edges.
 */

export type Vault = {
  assets: bigint;
  shares: bigint;
};

export const MAX_AMOUNT = 4_611_686_018_427_387_903n;

export function assertAmount(amount: bigint): bigint {
  if (typeof amount !== "bigint") throw new Error("amount must be bigint");
  if (amount < 0n) throw new Error("amount must not be negative");
  if (amount > MAX_AMOUNT) throw new Error("amount exceeds MAX_AMOUNT");
  return amount;
}

export function emptyVault(): Vault {
  return { assets: 0n, shares: 0n };
}

/**
 * Shares to mint for a deposit.
 * First depositor: 1:1.
 * Else: floor(deposit * totalShares / totalAssets).
 */
export function sharesForDeposit(vault: Vault, deposit: bigint): bigint {
  assertAmount(deposit);
  if (deposit === 0n) throw new Error("deposit must be positive");
  if (vault.assets === 0n || vault.shares === 0n) {
    if (vault.assets !== 0n || vault.shares !== 0n) {
      throw new Error("inconsistent empty vault");
    }
    return deposit;
  }
  return (deposit * vault.shares) / vault.assets;
}

/**
 * Assets returned for a share burn.
 * Uses ceiling division so the vault keeps residual wei:
 * ceil(sharesBurn * assets / totalShares).
 */
export function assetsForBurn(vault: Vault, sharesBurn: bigint): bigint {
  assertAmount(sharesBurn);
  if (sharesBurn === 0n) throw new Error("sharesBurn must be positive");
  if (vault.shares === 0n) throw new Error("no shares");
  if (sharesBurn > vault.shares) throw new Error("exceeds total shares");
  // ceil(a/b) = (a + b - 1) / b for positive integers
  return (sharesBurn * vault.assets + vault.shares - 1n) / vault.shares;
}

export function deposit(vault: Vault, amount: bigint): { vault: Vault; minted: bigint } {
  const minted = sharesForDeposit(vault, amount);
  if (minted === 0n) throw new Error("deposit too small to mint shares");
  return {
    vault: {
      assets: vault.assets + amount,
      shares: vault.shares + minted,
    },
    minted,
  };
}

export function withdraw(
  vault: Vault,
  sharesBurn: bigint
): { vault: Vault; assetsOut: bigint } {
  const assetsOut = assetsForBurn(vault, sharesBurn);
  if (assetsOut > vault.assets) throw new Error("internal: assetsOut exceeds vault");
  return {
    vault: {
      assets: vault.assets - assetsOut,
      shares: vault.shares - sharesBurn,
    },
    assetsOut,
  };
}
