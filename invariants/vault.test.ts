import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  emptyVault,
  deposit,
  withdraw,
  sharesForDeposit,
  assetsForBurn,
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

  it("refuses zero deposit", () => {
    assert.throws(() => deposit(emptyVault(), 0n), /positive/);
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
  });

  it("refuses burn above total shares", () => {
    const { vault } = deposit(emptyVault(), 100n);
    assert.throws(() => withdraw(vault, 101n), /exceeds/);
  });
});
