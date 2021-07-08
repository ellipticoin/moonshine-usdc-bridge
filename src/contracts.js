import { ethers } from "ethers";
import TreasuryABI from "./abis/TreasuryABI.mjs";
import BridgeABI from "./abis/BridgeABI.mjs";

export const {
  SNOWPACK_PUBLIC_BRIDGE_CONTRACT_ADDRESS,
  SNOWPACK_PUBLIC_TREASURY_CONTRACT_ADDRESS,
  SNOWPACK_PUBLIC_WEB3_URL,
  SNOWPACK_PUBLIC_FORIEGN_WEB3_URL,
} = import.meta.env;

export const SIGNER = new ethers.providers.Web3Provider(
  window.ethereum,
  "any",
).getSigner();

export const FORIEGN_PROVIDER = new ethers.providers.JsonRpcProvider(
  SNOWPACK_PUBLIC_FORIEGN_WEB3_URL,
);
export const PROVIDER = new ethers.providers.JsonRpcProvider(
  SNOWPACK_PUBLIC_WEB3_URL,
);
export const TREASURY = new ethers.Contract(
  SNOWPACK_PUBLIC_TREASURY_CONTRACT_ADDRESS,
  TreasuryABI,
  FORIEGN_PROVIDER,
);
export const BRIDGE = new ethers.Contract(
  SNOWPACK_PUBLIC_BRIDGE_CONTRACT_ADDRESS,
  BridgeABI,
  PROVIDER,
);
