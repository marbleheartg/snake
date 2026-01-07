import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const proxyModule = buildModule("ProxyModule", (m) => {
  const proxyAdminOwner = m.getAccount(0);

  const contract = m.contract("Contract");

  const initData = m.encodeFunctionCall(contract, "initialize", [
    proxyAdminOwner,
  ]);

  const proxy = m.contract("TransparentUpgradeableProxy", [
    contract,
    proxyAdminOwner,
    initData,
  ]);

  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin",
  );

  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

  return { proxyAdmin, proxy };
});

const contractModule = buildModule("ContractModule", (m) => {
  const { proxy, proxyAdmin } = m.useModule(proxyModule);

  const contract = m.contractAt("Contract", proxy);

  return { contract, proxy, proxyAdmin };
});

export default contractModule;
