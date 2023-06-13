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
let odinsOwner: Signer, user1: Signer, user2: Signer, user3: Signer;  

// speed up time
async function increaseTime(duration: number) {
  await ethers.provider.send('evm_increaseTime', [duration]);
  await ethers.provider.send('evm_mine', []);
}

describe('OdinsOddsFactory', function () {

  
  beforeEach(async () => {
		[odinsOwner, user1, user2, user3] = await ethers.getSigners();
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
    let gameAddress: string;

    beforeEach(async () => {
      gameAddress = await gameContract.address;
      const unixNow = Math.floor(Date.now());
      const unixHourAhead = Math.floor(Date.now() / 1000) + 3600;
      const unixWeekAhead = Math.floor(Date.now() / 1000) + 604800;
      const game1 = await gameContract.connect(user1).games(0);
      const game2 = await gameContract.connect(user1).games(1);
      await odinsOdds.connect(odinsOwner).createWager(gameAddress, game1.ID, unixWeekAhead,2);
      await odinsOdds.connect(user1).createWager(gameAddress, game2.ID, unixWeekAhead,2);
      const firstWagerAddress = await odinsOdds.wagersMap(0);
      wager1 = new ethers.Contract(firstWagerAddress, wagerJson.abi, user1);
    });

    it('should create new wager contract', async function () {
      const wager1ID = await wager1.connect(user1).getContractID();
      expect(wager1ID).to.equal(0);
    });

    it('gets current phase of wager', async function () {
      const currentPhase = await wager1.connect(user1).getWagerStage();
      expect(currentPhase).to.equal(0);
    });

    it('can place bets', async function () {
      await wager1.connect(user1).placeBet(1, { value: ethers.utils.parseEther('1') })
      await wager1.connect(user2).placeBet(2, { value: ethers.utils.parseEther('1.5') })
      const bet1 = await wager1.getBet(0)
      const bet2 = await wager1.getBet(1)
      expect(bet1.amount).to.equal(ethers.utils.parseEther('1'));
      expect(bet2.amount).to.equal(ethers.utils.parseEther('1.5'));
      expect(bet1.prediction).to.equal(1);
      expect(bet2.prediction).to.equal(2);
      const stage1 = await wager1.getWagerStage()
      console.log(stage1, "stage")
      
      console.log(await ethers.provider.getBlockNumber())
      await increaseTime(3 * 24 * 60 * 60); // Simulate the passing of 3 days
      console.log(await ethers.provider.getBlockNumber())
      await wager1.connect(user3).placeBet(1, { value: ethers.utils.parseEther('1.5') })
      const stage2 = await wager1.getWagerStage()
      console.log(stage2, "stage")
    });

    it('should reject bad bets', async function () {
      const badBet = wager1.placeBet(3, { value: ethers.utils.parseEther('1') })
      await expect(badBet).to.be.revertedWith('Invalid prediction. Use 1 for Red, 2 for Blue');
    });

    
    it('mock decides winner, updates mapping, emits event, listens for events', async function () {
      let eventPromise = new Promise<{ gameId: number; status: number }>((resolve, reject) => {
        gameContract.on('GameResult', (gameId: number, status: number, event: Event) => {
          // resolve the promise when the event is triggered
          resolve({ gameId, status });
        });
      });
      const tx = await gameContract.connect(user1).decideWinner(0, true);
      const receipt = await tx.wait();
      const game0Mapping = await gameContract.games(0);
      let { gameId, status } = await eventPromise;
      // if statement is for typescript checks if event exists first
      if (receipt.events && receipt.events[0]?.args) {
        expect(receipt.events[0].args.status).to.equal(1);
      } else {
        throw new Error("Events or Args are undefined");
      }
      expect(game0Mapping.status).to.equal(1);
      expect(gameId).to.equal(0);
      expect(status).to.equal(1);
      // NOTE: on the front end you can use the event to call a contract do do something end the predictions
    });

    it('finds winner', async function () {
      await gameContract.decideWinner(0, true);
      const wagerStatus = await wager1.checkGameResult(0);
      const status = await gameContract.getGameResult(0);
      expect(status).to.equal(1);
      console.log(wagerStatus);
      expect(wagerStatus).to.equal("Red wins")
    });

  });




});


