const { expect } = require('chai');
const { ethers } = require('hardhat');
import { Signer } from 'ethers';


describe('OdinsOdds', function () {
  let odinsOdds: any;
  let odinsOwner: Signer; 
  
  beforeEach(async () => {
		[odinsOwner] = await ethers.getSigners();
    const OodinsOdds = await ethers.getContractFactory('OdinsOdds');
    odinsOdds = await OodinsOdds.connect(odinsOwner).deploy();
    await odinsOdds.deployed();
  });

  it('IDAO is confirmed should return true', async function () {
    const isConfirmedResult = await odinsOdds.connect(odinsOwner).isConfirmed(true);
    await expect(isConfirmedResult).to.equal(true);
	});

  it('Should return new wager and add new wager to mapping', async function () {
    const newWager1 = await odinsOdds.connect(odinsOwner).createWager(5,10,3);
    const newWager2 = await odinsOdds.connect(odinsOwner).createWager(1,2,3);
    const newWager3 = await odinsOdds.connect(odinsOwner).createWager(4,5,6);
    const retrievedMapping = await odinsOdds.connect(odinsOwner).wagersMap(1);
    console.log(retrievedMapping);
	});
  

});