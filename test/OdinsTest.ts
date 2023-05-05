const { expect } = require('chai');
const { ethers } = require('hardhat');
// import { Signer } from "../typechain-types";
import { Signer } from 'ethers';


describe('OdinsOdds', function () {
  let odinsOdds: any;
  let odinsOwner: Signer, user1: Signer, user2: Signer; ; 
  
  beforeEach(async () => {
		[odinsOwner, user1, user2] = await ethers.getSigners();
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
    await odinsOdds.connect(odinsOwner).createWager(5,10,2);
    await odinsOdds.connect(odinsOwner).createWager(1,2,2);
    await odinsOdds.connect(user1).placeBet(1,0,40000000);
    const bet = await odinsOdds.getBet(0,0);
    expect(bet.amount).to.equal(40000000);
  });

  it('Should check if wage has ended', async function () {
    const unixHourAhead = Math.floor(Date.now() / 1000) + 3600;
    await odinsOdds.connect(odinsOwner).createWager(unixHourAhead,10,2);
    const futureTimeStamp = await odinsOdds.connect(user1).hasWagerEnded(0);
    await odinsOdds.connect(odinsOwner).createWager(1683310434,10,2);
    const pastTimeStamp = await odinsOdds.connect(user1).hasWagerEnded(1);
    expect(futureTimeStamp).to.equal(false);
    expect(pastTimeStamp).to.equal(true);
  });

});