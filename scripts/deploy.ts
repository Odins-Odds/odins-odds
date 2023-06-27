// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const OdinsOddsFactory = await hre.ethers.getContractFactory("OdinsOddsFactory");
  const odinsOddsFactory = await OdinsOddsFactory.deploy();

  await odinsOddsFactory.deployed();
  console.log("Contract address:", odinsOddsFactory.address);
  const provider = hre.ethers.getDefaultProvider();
  const blockNumber = await provider.getBlockNumber();
  console.log('current block number: ',blockNumber);

  saveFrontendFiles(odinsOddsFactory);
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
    JSON.stringify({ odinsOddsFactory: contract.address }, undefined, 2)
  );

  const OdinsOddsFactory = hre.artifacts.readArtifactSync("OdinsOddsFactory");

  fs.writeFileSync(
    contractsDir + "/odinsOddsFactory.json",
    JSON.stringify(OdinsOddsFactory, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});