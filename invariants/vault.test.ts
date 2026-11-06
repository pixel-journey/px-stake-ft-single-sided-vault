import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  emptyVault,
  deposit,
  withdraw,
  sharesForDeposit,
  assetsForBurn,
  MAX_AMOUNT,
  assertAmount,
} from "./vault.ts";

describe("deposit", () => {
  it("first deposit is 1:1", () => {
    const { vault, minted } = deposit(emptyVault(), 1000n);
    assert.equal(minted, 1000n);
    assert.equal(vault.assets, 1000n);
    assert.equal(vault.shares, 1000n);
  });

  it("later deposit rounds shares down", () => {
    let { vault } = deposit(emptyVault(), 1000n);
    // Simulate yield: assets grow without new shares
    vault = { assets: 1500n, shares: vault.shares };
    const minted = sharesForDeposit(vault, 100n);
    // floor(100 * 1000 / 1500) = floor(66.66) = 66
    assert.equal(minted, 66n);
  });

  it("later deposit mutates vault with floor mint", () => {
    let { vault } = deposit(emptyVault(), 1000n);
    vault = { assets: 1500n, shares: vault.shares };
    const result = deposit(vault, 100n);
    assert.equal(result.minted, 66n);
    assert.equal(result.vault.assets, 1600n);
    assert.equal(result.vault.shares, 1066n);
  });

  it("refuses zero deposit", () => {
    assert.throws(() => deposit(emptyVault(), 0n), /positive/);
  });

  it("refuses a deposit too small to mint shares", () => {
    // After yield, 1 unit deposits to zero shares: floor(1 * 1000 / 1500) = 0
    const vault = { assets: 1500n, shares: 1000n };
    assert.throws(() => deposit(vault, 1n), /deposit too small to mint shares/);
    assert.equal(vault.assets, 1500n);
    assert.equal(vault.shares, 1000n);
  });

  it("refuses assets without shares", () => {
    assert.throws(
      () => sharesForDeposit({ assets: 100n, shares: 0n }, 10n),
      /inconsistent empty vault/,
    );
  });

  it("refuses shares without assets", () => {
    assert.throws(
      () => sharesForDeposit({ assets: 0n, shares: 100n }, 10n),
      /inconsistent empty vault/,
    );
  });
});

describe("withdraw", () => {
  it("full exit returns assets", () => {
    let { vault } = deposit(emptyVault(), 1000n);
    const out = withdraw(vault, 1000n);
    assert.equal(out.assetsOut, 1000n);
    assert.equal(out.vault.shares, 0n);
    assert.equal(out.vault.assets, 0n);
  });

  it("partial burn uses ceiling assets", () => {
    const vault = { assets: 1000n, shares: 3n };
    // ceil(1 * 1000 / 3) = ceil(333.33) = 334
    assert.equal(assetsForBurn(vault, 1n), 334n);
    const out = withdraw(vault, 1n);
    assert.equal(out.assetsOut, 334n);
    assert.equal(out.vault.assets, 666n);
    assert.equal(out.vault.shares, 2n);
  });

  it("ceiling withdraw leaves residual for remaining shares", () => {
    // Three sequential burns of 1 share from 1000/3 should not overpay
    let vault = { assets: 1000n, shares: 3n };
    const a = withdraw(vault, 1n);
    vault = a.vault;
    const b = withdraw(vault, 1n);
    vault = b.vault;
    const c = withdraw(vault, 1n);
    assert.equal(a.assetsOut + b.assetsOut + c.assetsOut, 1000n);
    assert.equal(c.vault.assets, 0n);
    assert.equal(c.vault.shares, 0n);
  });

  it("refuses burn above total shares", () => {
    const { vault } = deposit(emptyVault(), 100n);
    assert.throws(() => withdraw(vault, 101n), /exceeds/);
  });

  it("refuses zero share burn", () => {
    const { vault } = deposit(emptyVault(), 100n);
    assert.throws(() => withdraw(vault, 0n), /positive/);
  });

  it("refuses burn when vault has no shares", () => {
    assert.throws(() => assetsForBurn(emptyVault(), 1n), /no shares/);
  });
});

describe("assertAmount", () => {
  it("refuses negative amounts", () => {
    assert.throws(() => assertAmount(-1n), /negative/);
  });

  it("refuses amounts above MAX_AMOUNT", () => {
    assert.throws(() => assertAmount(MAX_AMOUNT + 1n), /MAX_AMOUNT/);
  });

  it("accepts MAX_AMOUNT", () => {
    assert.equal(assertAmount(MAX_AMOUNT), MAX_AMOUNT);
  });
});
