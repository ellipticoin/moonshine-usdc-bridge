import dotenv from "dotenv";
import express from "express";
import path from "path";
import { ethers } from "ethers";
import { fileURLToPath } from "url";
import TreasurayABI from "./src/abis/TreasuryABI.mjs";
import BridgeABI from "./src/abis/BridgeABI.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const PORT = process.env.PORT || 5000;

const {
  SNOWPACK_PUBLIC_FORIEGN_WEB3_URL,
  SNOWPACK_PUBLIC_WEB3_URL,
  SNOWPACK_PUBLIC_TREASURY_CONTRACT_ADDRESS,
  SNOWPACK_PUBLIC_BRIDGE_CONTRACT_ADDRESS,
  PRIVATE_KEY,
  PRIVATE_KEY_SEED,
} = process.env;
const provider = new ethers.providers.JsonRpcProvider(SNOWPACK_PUBLIC_WEB3_URL);
let wallet;
if (PRIVATE_KEY) {
  wallet = new ethers.Wallet(PRIVATE_KEY, provider);
} else {
  const mnemonic = ethers.utils.entropyToMnemonic(Buffer.from(PRIVATE_KEY_SEED, "hex").slice(0, 32));
  wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);
}
const foriegnProvider = new ethers.providers.JsonRpcProvider(SNOWPACK_PUBLIC_FORIEGN_WEB3_URL);
let latestBlock;
const TRANSACTION_TYPES = ["DEPOSIT", "WITHDRAW", "TRANSFER"];
const TREASURY = new ethers.Contract(
  SNOWPACK_PUBLIC_TREASURY_CONTRACT_ADDRESS,
  TreasurayABI,
  foriegnProvider,
);
const BRIDGE = new ethers.Contract(
  SNOWPACK_PUBLIC_BRIDGE_CONTRACT_ADDRESS,
  BridgeABI,
  wallet,
);
setInterval(async () => {
  const blockNumber =await foriegnProvider.getBlockNumber()
  if (blockNumber === latestBlock) return;
  const fromBlock = latestBlock ? latestBlock + 1 : blockNumber;
  console.log(`${fromBlock} - ${blockNumber}`);
  latestBlock = blockNumber;
  const logs = (
    await foriegnProvider.getLogs({
      address: TREASURY.address,
      fromBlock,
      toBlock: blockNumber,
    })
  ).map((log) => ({
    transactionHash: log.transactionHash,
    ...TREASURY.interface.parseLog(log),
  }));
  console.log(`Got ${logs.length} logs`);
  await Promise.all(logs.map(processLog));
}, 3000);

async function processLog(log) {
  let tx;

  switch (log.name) {
    case "Deposit":
      console.log("submitting transaction");
      tx = await BRIDGE.submitTransaction({
        transactionHash: log.transactionHash,
        transactionType: TRANSACTION_TYPES.indexOf("DEPOSIT"),
        sender: log.args._sender,
        amount: log.args._amount,
      });
      await tx.wait();
      break;
    default:
  }
}

express()
  .use(express.static(path.join(__dirname, "build")))
  // .get("/api/address", (req, res) => res.json(wallet.getAddress()))
  .get("/*", (req, res) => res.sendFile(`${path.join(__dirname, "build")}/index.html`))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
