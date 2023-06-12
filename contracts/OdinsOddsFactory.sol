// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*
TODO
[] find out on chain data to use (try with aavegotchi or find something else)
[X] user can create bets figure out what inputes will be needed
    inputs 
        time 
        expirey
        bet options
        address

[X] make wagers
[X] make bets
[] add chunks of time that users can bet
[] time based distrebution mecanism 
[] distrabution 40%, 30%, 20%, 10%
    choose winning group option
    math for time period distrabution
*/

import "./interfaces/IGame.sol";
import "hardhat/console.sol";

contract OdinsOddsFactory {
    address public odinsOwner;
    uint256 public nextWagerId;

    mapping(uint256 => Wager) public wagersMap;

    constructor() {
        odinsOwner = msg.sender;
    }

    // creator decieds when people can stop betting
    function createWager(
        address _gameContract,
        uint256 _gameID,
        uint256 _unixTime,
        uint256 _expiry,
        uint256 _betChoices
    ) public returns (uint256) {
        Wager newWager = new Wager(
            _gameContract,
            _gameID,
            nextWagerId,
            _unixTime,
            _expiry,
            _betChoices,
            payable(msg.sender)
        );
        wagersMap[nextWagerId] = newWager;
        nextWagerId++;

        return nextWagerId - 1;
    }
}

contract Wager {
    address gameContract;
    uint256 public gameID;
    uint256 public ID;
    uint256 public time;
    uint256 public expiry;
    uint256 public betChoices;
    address payable public wagerOwner;
    address gameInstance;
    Stage wagerStage;
    string public gameResult;

    Bet[] public bets;

    struct Bet {
        address payable bettor;
        uint256 prediction;
        uint256 amount;
        Stage phase;
    }

    enum Stage {
        phase1,
        phase2,
        phase3,
        phase4,
        end
    }

    constructor(
        address _gameContract,
        uint256 _gameId,
        uint256 _ID,
        uint256 _unixTime,
        uint256 _expiry,
        uint256 _betChoices,
        address payable _wagerOwner
    ) {
        gameContract = _gameContract;
        gameID = _gameId;
        ID = _ID;
        time = _unixTime;
        expiry = _expiry;
        betChoices = _betChoices;
        wagerOwner = _wagerOwner;
        wagerStage = Stage.phase1;
    }

    function placeBet(uint256 _prediction) public payable {
        require(
            _prediction == 1 || _prediction == 2,
            "Invalid prediction. Use 1 for Red, 2 for Blue"
        );
        Stage currentPhase = getWagerStage();
        require(currentPhase != Stage.end, "Wager has ended");

        Bet memory newBet = Bet({
            bettor: payable(msg.sender),
            prediction: _prediction,
            amount: msg.value,
            phase: Stage.phase1
        });

        bets.push(newBet);
    }

    // TODO distribute winnings It will probably be best to allow users to withdraw from contract so create a withdraw function

    function checkGameResult(uint256 _ID) public view {
        IGame game = IGame(gameContract);
        IGame.GameStatus gameStatus = game.getGameResult(_ID);
        // gameResult = getGameResult();
        // return gameStatus.;
        // console.log(game);
        if (gameStatus == IGame.GameStatus.RedWins) {
            // distributeWinnings(1);
            console.log("Red wins distribution");
        } else if (gameStatus == IGame.GameStatus.BlueWins) {
            // distributeWinnings(2);
            console.log("Blue wins distribution");
        }
    }

    // function distributeWinnings(uint256 winningTeam) private {
    //     uint256 totalWinnings = address(this).balance;
    //     uint256[] memory distribution = new uint256[](4);
    //     distribution[0] = (totalWinnings * 40) / 100; // Phase 1 gets 40%
    //     distribution[1] = (totalWinnings * 30) / 100; // Phase 2 gets 30%
    //     distribution[2] = (totalWinnings * 20) / 100; // Phase 3 gets 20%
    //     distribution[3] = (totalWinnings * 10) / 100; // Phase 4 gets 10%

    //     // Calculate the total amount of winning bets in each phase
    //     uint256[4] memory totalPhaseBets = [0, 0, 0, 0];
    //     for (uint256 i = 0; i < bets.length; i++) {
    //         if (bets[i].prediction == winningTeam) {
    //             totalPhaseBets[uint256(bets[i].phase)] += bets[i].amount;
    //         }
    //     }

    //     // Distribute the winnings
    //     for (uint256 i = 0; i < bets.length; i++) {
    //         if (
    //             bets[i].prediction == winningTeam &&
    //             totalPhaseBets[uint256(bets[i].phase)] != 0
    //         ) {
    //             uint256 winnings = (bets[i].amount *
    //                 distribution[uint256(bets[i].phase)]) /
    //                 totalPhaseBets[uint256(bets[i].phase)];
    //             payable(bets[i].bettor).transfer(winnings);
    //         }
    //     }
    // }

    mapping(address => uint256) public balances;

    function distributeFunds(
        address[] memory recipients,
        uint256[] memory amounts
    ) public payable {
        require(
            recipients.length == amounts.length,
            "Array lengths do not match"
        );
        uint256 total = 0;
        for (uint i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }
        require(msg.value >= total, "Not enough funds sent");
        for (uint i = 0; i < recipients.length; i++) {
            balances[recipients[i]] += amounts[i];
        }
    }

    function withdrawFunds() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds available for withdrawal");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // ======================== Getter Functions ========================

    function getContractID() public view returns (uint256) {
        return ID;
    }

    function getBet(uint256 _index) public view returns (Bet memory) {
        return bets[_index];
    }

    function hasWagerEnded() public view returns (bool) {
        return block.timestamp >= time;
    }

    function getWagerStage() public view returns (Stage) {
        return wagerStage;
    }
}
