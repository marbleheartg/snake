import { network } from "hardhat";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getAddress, parseEther } from "viem";
import ContractModule from "../ignition/modules/ProxyModule.js";

describe("Contract", async function () {
  const { ignition, viem } = await network.connect();

  const [owner, player1, player2] = await viem.getWalletClients();

  const publicClient = await viem.getPublicClient();

  const PLAY_FEE = parseEther("0");

  const { contract } = await ignition.deploy(ContractModule, {
    parameters: {
      ContractModule: {
        initialOwner: owner.account.address,
        initialPlayFee: PLAY_FEE,
      },
    },
  });

  /*//////////////////////////////////////////////////////////////
                          PROXY / INIT
  //////////////////////////////////////////////////////////////*/
  describe("Initialization", function () {
    it("should set correct owner via proxy", async function () {
      assert.equal(
        getAddress(await contract.read.owner()),
        getAddress(owner.account.address),
      );
    });

    it("should set initial play fee", async function () {
      assert.equal(await contract.read.playFee(), PLAY_FEE);
    });
  });

  /*//////////////////////////////////////////////////////////////
                          SUBMIT SCORE
  //////////////////////////////////////////////////////////////*/
  describe("submitScore", function () {
    it("reverts on zero score", async function () {
      await assert.rejects(
        contract.write.submitScore([0n], {
          value: PLAY_FEE,
          account: player1.account,
        }),
      );
    });

    // it("reverts if fee is insufficient", async function () {
    //   await assert.rejects(
    //     contract.write.submitScore([10n], {
    //       value: 0n,
    //       account: player1.account,
    //     }),
    //   );
    // });

    it("accepts valid score", async function () {
      await contract.write.submitScore([10n], {
        value: PLAY_FEE,
        account: player1.account,
      });

      const stats = await contract.read.getPlayerStats([
        player1.account.address,
      ]);

      assert.equal(stats[0], 10n); // bestScore
      assert.equal(stats[1], 1n); // gamesPlayed
    });

    it("updates personal best only when higher", async function () {
      await contract.write.submitScore([5n], {
        value: PLAY_FEE,
        account: player1.account,
      });

      const stats = await contract.read.getPlayerStats([
        player1.account.address,
      ]);

      assert.equal(stats[0], 10n); // still bestScore
      assert.equal(stats[1], 2n);
    });
  });

  /*//////////////////////////////////////////////////////////////
                        GLOBAL RECORD
  //////////////////////////////////////////////////////////////*/
  describe("Global record", function () {
    it("updates global best score", async function () {
      await contract.write.submitScore([50n], {
        value: PLAY_FEE,
        account: player2.account,
      });

      assert.equal(await contract.read.globalBestScore(), 50n);
      assert.equal(
        getAddress(await contract.read.globalBestPlayer()),
        getAddress(player2.account.address),
      );
    });
  });

  /*//////////////////////////////////////////////////////////////
                          LEADERBOARD
  //////////////////////////////////////////////////////////////*/
  describe("Leaderboard", function () {
    it("adds scores to leaderboard in correct order", async function () {
      await contract.write.submitScore([30n], {
        value: PLAY_FEE,
        account: owner.account,
      });

      const leaderboard = await contract.read.getLeaderboard();

      assert.equal(leaderboard[0].score, 50n);
      assert.equal(
        getAddress(leaderboard[0].player),
        getAddress(player2.account.address),
      );

      assert.equal(leaderboard[1].score, 30n);
      assert.equal(
        getAddress(leaderboard[1].player),
        getAddress(owner.account.address),
      );
    });

    it("does not insert low score into top leaderboard", async function () {
      await contract.write.submitScore([1n], {
        value: PLAY_FEE,
        account: player1.account,
      });

      const leaderboard = await contract.read.getLeaderboard();

      // top score unchanged
      assert.equal(leaderboard[0].score, 50n);
    });
  });

  /*//////////////////////////////////////////////////////////////
                          ADMIN
  //////////////////////////////////////////////////////////////*/
  describe("Admin functions", function () {
    it("only owner can set play fee", async function () {
      await assert.rejects(
        contract.write.setPlayFee([parseEther("1")], {
          account: player1.account,
        }),
      );

      await contract.write.setPlayFee([parseEther("0.02")], {
        account: owner.account,
      });

      assert.equal(await contract.read.playFee(), parseEther("0.02"));
    });
  });
});
