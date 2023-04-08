const { expect } = require('chai');
const { ethers } = require('hardhat');
// import { DepositorCoin } from "../typechain-types";
import { Signer } from 'ethers';


describe('OdinsOdds', function () {
  let odinsOdds: any;
  let odinsOwner: Signer; 
  
  beforeEach(async () => {
		[odinsOwner] = await ethers.getSigners();
    const OodinsOdds = await ethers.getContractFactory('OdinsOdds');
    odinsOdds = await OodinsOdds.deploy();
    await odinsOdds.deployed();
  });

  it('IDAO is confirmed should return true', async function () {
    const isConfirmedResult = await odinsOdds.isConfirmed(true);
    expect(isConfirmedResult).to.equal(true);
	});

  it('Should return new wager and add new wager to mapping', async function () {
    await odinsOdds.connect(odinsOwner).createWager(5,10,2);
    await odinsOdds.connect(odinsOwner).createWager(1,2,2);
    // await odinsOdds.connect(odinsOwner).createWager(4,5,6);
    const retrievedMapping = await odinsOdds.connect(odinsOwner).wagersMap(1);
    expect(retrievedMapping.ID).to.equal(1);
	});

  it('Should place new bet', async function () {
  
  });

});