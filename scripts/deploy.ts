
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {

  const Aggregator = await hre.ethers.getContractFactory("Aggregator");
  const aggregator = await Aggregator.deploy();

  await aggregator.deployed();
  console.log("Contract address:", aggregator.address);
  const provider = hre.ethers.getDefaultProvider();
  const blockNumber = await provider.getBlockNumber();
  console.log('current block number: ',blockNumber);

  saveFrontendFiles(aggregator);
}

// the magical code that links your contract to the frontend
function saveFrontendFiles(contract: any) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/abis";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Aggregator: contract.address }, undefined, 2)
  );

  const AggregatorArtifact = hre.artifacts.readArtifactSync("Aggregator");

  fs.writeFileSync(
    contractsDir + "/Aggregator.json",
    JSON.stringify(AggregatorArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});