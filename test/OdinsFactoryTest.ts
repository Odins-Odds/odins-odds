const { expect } = require('chai');
const { ethers } = require('hardhat');
const wagerJson = require('../artifacts/contracts/OdinsOddsFactory.sol/Wager.json');
// import { Signer } from "../typechain-types";
import { Signer } from 'ethers';

import { OdinsOddsFactory } from "../typechain-types/OdinsOddsFactory.sol";
import { Wager } from "../typechain-types/OdinsOddsFactory.sol";
import { Game } from "../typechain-types/mocks/Game";

let odinsOdds: OdinsOddsFactory;
let gameContract: Game;
let odinsOwner: Signer, user1: Signer, user2: Signer; ; 

describe('OdinsOddsFactory', function () {

  
  beforeEach(async () => {
		[odinsOwner, user1, user2] = await ethers.getSigners();
    const OdinsOdds = await ethers.getContractFactory('OdinsOddsFactory');
    odinsOdds = await OdinsOdds.deploy();
    await odinsOdds.deployed();
    const GameContract = await ethers.getContractFactory('Game');
    gameContract = await GameContract.deploy();
    await gameContract.deployed();
    await gameContract.createGame();
    await gameContract.createGame();
  });

  it('deployer address owns the odins odds contract', async function () {
    const contractOwner = await odinsOdds.odinsOwner();
    const odinsOwnerAddress = await odinsOwner.getAddress();
    expect(contractOwner).to.equal(odinsOwnerAddress);
	});

  it('Game Mock is working', async function () {
    const game1 = await gameContract.connect(user1).games(0);
    expect(game1.ID).to.equal(0);
    expect(game1.status).to.equal(0);
	});
  
  
  describe('Wager', function () {

    let wager1: Wager;

    beforeEach(async () => {
      const gameAddress = await gameContract.address;
      const unixHourAhead = Math.floor(Date.now() / 1000) + 3600;
      const game1 = await gameContract.connect(user1).games(0);
      const game2 = await gameContract.connect(user1).games(1);
      await odinsOdds.connect(odinsOwner).createWager(gameAddress, game1.ID, unixHourAhead,10,2);
      await odinsOdds.connect(user1).createWager(gameAddress, game2.ID, unixHourAhead,10,2);
      const firstWagerAddress = await odinsOdds.wagersMap(0);
      wager1 = new ethers.Contract(firstWagerAddress, wagerJson.abi, user1);
    });

    it('should create new wager contract', async function () {
      const wager1ID = await wager1.connect(user1).getContractID();
      expect(wager1ID).to.equal(0);
    });

    it('can place bets', async function () {
      await wager1.placeBet(1, { value: ethers.utils.parseEther('1') })
      await wager1.connect(user2).placeBet(2, { value: ethers.utils.parseEther('1.5') })
      const bet1 = await wager1.getBet(0)
      const bet2 = await wager1.getBet(1)
      expect(bet1.amount).to.equal(ethers.utils.parseEther('1'));
      expect(bet2.amount).to.equal(ethers.utils.parseEther('1.5'));
      expect(bet1.prediction).to.equal(1);
      expect(bet2.prediction).to.equal(2);
    });

    it('should reject bad bets', async function () {
      const badBet = wager1.placeBet(3, { value: ethers.utils.parseEther('1') })
      await expect(badBet).to.be.revertedWith('Invalid prediction. Use 1 for Red, 2 for Blue');
    });

    it('should reject bad bets', async function () {

    });



    // TODO when event is triggered call contract to update the state of wager

  });


  // it('Should return new wager and add new wager to mapping', async function () {
  //   await odinsOdds.connect(odinsOwner).createWager(5,10,2);
  //   await odinsOdds.connect(odinsOwner).createWager(1,2,2);
  //   // await odinsOdds.connect(odinsOwner).createWager(4,5,6);
  //   const retrievedMapping = await odinsOdds.connect(odinsOwner).wagersMap(1);
  //   expect(retrievedMapping.ID).to.equal(1);
	// });

  // it('Should checks if wager ended or not', async function () {
  //   const unixHourAhead = Math.floor(Date.now() / 1000) + 3600;
  //   await odinsOdds.connect(odinsOwner).createWager(unixHourAhead,10,2);
  //   const futureTimeStamp = await odinsOdds.connect(user1).hasWagerEnded(0);
  //   await odinsOdds.connect(odinsOwner).createWager(1683310434,10,2);
  //   const pastTimeStamp = await odinsOdds.connect(user1).hasWagerEnded(1);
  //   expect(futureTimeStamp).to.equal(false);
  //   expect(pastTimeStamp).to.equal(true);
  // });

});


