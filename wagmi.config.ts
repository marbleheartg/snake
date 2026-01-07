import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { Abi } from "viem";

import contractAbi from "./artifacts/contracts/Contract.sol/Contract.json";

export default defineConfig({
  out: `abi/contractAbi.ts`,
  contracts: [
    {
      name: "Contract",
      abi: contractAbi.abi as Abi,
    },
  ],
  plugins: [react()],
});
