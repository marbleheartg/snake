import { network } from "hardhat";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getAddress } from "viem";
import ContractModule from "../ignition/modules/ProxyModule.js";
// import NewContractModule from "../ignition/modules/UpgradeModule.js";

describe("Contract", async function () {
  const { ignition, viem } = await network.connect();

  const [owner, otherAccount] = await viem.getWalletClients();

  const { contract } = await ignition.deploy(ContractModule);

  describe("Proxy interaction", function () {
    it("Should be usable via proxy", async function () {
      assert.equal(
        getAddress(await contract.read.owner()),
        getAddress(owner.account.address),
      );
    });
  });

  // describe("Upgrading", function () {
  //   it("Should have upgraded the proxy to DemoV2", async function () {
  //     const [, otherAccount] = await viem.getWalletClients();

  //     const { contract } = await ignition.deploy(NewContractModule);

  //     assert.equal(
  //       await contract.read.version({ account: otherAccount.account.address }),
  //       "2.0.0",
  //     );
  //   });

  //   it("Should have set the name during upgrade", async function () {
  //     const [, otherAccount] = await viem.getWalletClients();

  //     const { contract } = await ignition.deploy(NewContractModule);

  //     assert.equal(
  //       await contract.read.name({ account: otherAccount.account.address }),
  //       "Example Name",
  //     );
  //   });
  // });
});
