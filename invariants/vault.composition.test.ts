/**
 * Composition: multi-step deposit/withdraw with a per-account share book.
 * The pure vault only tracks totals. Production must also track who owns shares.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { emptyVault, deposit, withdraw, type Vault } from "./vault.ts";

type Book = Map<string, bigint>;

function credit(book: Book, account: string, shares: bigint): void {
  book.set(account, (book.get(account) ?? 0n) + shares);
}

function debit(book: Book, account: string, shares: bigint): void {
  const have = book.get(account) ?? 0n;
  if (shares > have) throw new Error("insufficient account shares");
  const next = have - shares;
  if (next === 0n) book.delete(account);
  else book.set(account, next);
}

function sumBook(book: Book): bigint {
  let t = 0n;
  for (const v of book.values()) t += v;
  return t;
}

describe("composition: multi-user vault desk", () => {
  it("two depositors share yield-style inflation on later deposit", () => {
    let vault = emptyVault();
    const book: Book = new Map();

    let r = deposit(vault, 1000n);
    vault = r.vault;
    credit(book, "alice", r.minted);

    vault = { assets: 1500n, shares: vault.shares };
    r = deposit(vault, 100n);
    vault = r.vault;
    credit(book, "bob", r.minted);

    assert.equal(r.minted, 66n);
    assert.equal(vault.assets, 1600n);
    assert.equal(vault.shares, 1066n);
    assert.equal(sumBook(book), vault.shares);
    assert.equal(book.get("alice"), 1000n);
    assert.equal(book.get("bob"), 66n);
  });

  it("withdraw only up to the account book, not the whole vault", () => {
    let vault = emptyVault();
    const book: Book = new Map();
    let r = deposit(vault, 1000n);
    vault = r.vault;
    credit(book, "alice", r.minted);
    r = deposit(vault, 1000n);
    vault = r.vault;
    credit(book, "bob", r.minted);

    assert.throws(() => debit(book, "alice", 1500n), /insufficient account shares/);
    debit(book, "alice", 500n);
    const out = withdraw(vault, 500n);
    vault = out.vault;
    assert.equal(sumBook(book), vault.shares);
  });

  it("full sequential exit conserves assets to zero", () => {
    let vault = emptyVault();
    const book: Book = new Map();
    let r = deposit(vault, 900n);
    vault = r.vault;
    credit(book, "alice", r.minted);
    r = deposit(vault, 100n);
    vault = r.vault;
    credit(book, "bob", r.minted);

    let paid = 0n;
    for (const who of ["alice", "bob"] as const) {
      const shares = book.get(who)!;
      const out = withdraw(vault, shares);
      vault = out.vault;
      paid += out.assetsOut;
      debit(book, who, shares);
    }
    assert.equal(vault.assets, 0n);
    assert.equal(vault.shares, 0n);
    assert.equal(book.size, 0);
    assert.equal(paid, 1000n);
  });

  it("ceiling partial burns still sum to vault assets", () => {
    let vault: Vault = { assets: 1000n, shares: 3n };
    let paid = 0n;
    for (let i = 0; i < 3; i++) {
      const out = withdraw(vault, 1n);
      vault = out.vault;
      paid += out.assetsOut;
    }
    assert.equal(paid, 1000n);
    assert.equal(vault.assets, 0n);
  });
});
