// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IGame.sol";
import "hardhat/console.sol";

contract OdinsOddsFactory {
    address public odinsOwner;
    uint256 public nextWagerId;

    mapping(uint256 => Wager) public wagersMap;

    event WagerCreated(
        uint256 indexed wagerId,
        address indexed owner,
        address gameContract,
        uint256 gameId,
        uint256 expiry,
        uint256 betChoices
    );

    constructor() {
        odinsOwner = msg.sender;
    }

    function createWager(
        address _gameContract,
        uint256 _gameID,
        uint256 _expiry,
        uint256 _betChoices
    ) public {
        Wager newWager = new Wager(
            _gameContract,
            _gameID,
            nextWagerId,
            _expiry,
            _betChoices,
            payable(msg.sender)
        );

        wagersMap[nextWagerId] = newWager;
        nextWagerId++;

        emit WagerCreated(
            nextWagerId,
            msg.sender,
            _gameContract,
            _gameID,
            _expiry,
            _betChoices
        );
    }

    function getWager(uint256 _wagerID) public view returns (Wager) {
        return wagersMap[_wagerID];
    }
}

contract Wager {
    address gameContract;
    uint256 public gameID;
    uint256 public ID;
    uint256 public wagerStartTime;
    uint256 public expiry;
    uint256 public totalWagerTime;
    uint256 public betChoices;
    address payable public wagerOwner;
    address gameInstance;
    Stage wagerStage;
    string public gameResult;

    mapping(Stage => Bet[]) public phaseBets;
    mapping(address => uint256) public winnings;

    event CheckGameResult(string message);

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
        uint256 _expiry,
        uint256 _betChoices,
        address payable _wagerOwner
    ) {
        gameContract = _gameContract;
        gameID = _gameId;
        ID = _ID;
        wagerStartTime = block.timestamp;
        expiry = _expiry;
        betChoices = _betChoices;
        wagerOwner = _wagerOwner;
        wagerStage = Stage.phase1;
        totalWagerTime = _expiry - block.timestamp;
    }

    function _setStage() private {
        uint256 elapsedTime = block.timestamp - wagerStartTime;

        uint256 oneFourthTime = totalWagerTime / 4;

        if (block.timestamp > expiry) {
            wagerStage = Stage.end;
        } else if (elapsedTime < oneFourthTime) {
            wagerStage = Stage.phase1;
        } else if (elapsedTime < 2 * oneFourthTime) {
            wagerStage = Stage.phase2;
        } else if (elapsedTime < 3 * oneFourthTime) {
            wagerStage = Stage.phase3;
        } else {
            wagerStage = Stage.phase4;
        }
    }

    function placeBet(uint256 _prediction) public payable {
        require(
            _prediction == 1 || _prediction == 2,
            "Invalid prediction. Use 1 for Red, 2 for Blue"
        );
        _setStage();
        Stage currentPhase = getWagerStage();
        require(currentPhase != Stage.end, "Wager has ended");

        Bet memory newBet = Bet({
            bettor: payable(msg.sender),
            prediction: _prediction,
            amount: msg.value,
            phase: wagerStage
        });
        phaseBets[wagerStage].push(newBet);
    }

    function checkGameResult(uint256 _ID) public returns (string memory) {
        IGame game = IGame(gameContract);
        IGame.GameStatus gameStatus = game.getGameResult(_ID);

        if (gameStatus == IGame.GameStatus.RedWins) {
            _distributeWinnings(1);
            emit CheckGameResult("Red wins");
            return "Red wins";
        } else if (gameStatus == IGame.GameStatus.BlueWins) {
            _distributeWinnings(2);
            emit CheckGameResult("Blue wins");
            return "Blue wins";
        } else {
            emit CheckGameResult("No result yet");
            return "No result yet";
        }
    }

    function _distributeWinnings(uint256 winningChoice) private {
        uint256 totalPool = address(this).balance;
        uint256[] memory phaseTotalBets = new uint256[](4);
        uint256[] memory phasePools = new uint256[](4);
        uint256 totalPhaseBets = 0;

        // Calculate total bets for each phase and the grand total.
        for (uint i = 0; i < 4; i++) {
            Bet[] storage bets = phaseBets[Stage(i)];
            for (uint j = 0; j < bets.length; j++) {
                if (bets[j].prediction == winningChoice) {
                    phaseTotalBets[i] += bets[j].amount;
                }
            }
            totalPhaseBets += phaseTotalBets[i];
        }

        // Calculate phase pools based on their total bets.
        for (uint i = 0; i < 4; i++) {
            if (totalPhaseBets > 0) {
                phasePools[i] =
                    (totalPool * phaseTotalBets[i]) /
                    totalPhaseBets;
            } else {
                phasePools[i] = 0;
            }
        }

        // Distribute the winnings.
        for (uint i = 0; i < 4; i++) {
            Bet[] storage bets = phaseBets[Stage(i)];
            for (uint j = 0; j < bets.length; j++) {
                if (bets[j].prediction == winningChoice) {
                    uint256 winnerShare = phasePools[i];
                    if (phaseTotalBets[i] > 0) {
                        winnerShare =
                            (phasePools[i] * bets[j].amount) /
                            phaseTotalBets[i];
                    }
                    winnings[bets[j].bettor] += winnerShare;
                }
            }
        }
    }

    function withdrawWinnings() public {
        uint256 amount = winnings[msg.sender];
        require(amount > 0, "No winnings available for withdrawal");
        winnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // ======================== Getter Functions ========================

    function getContractID() public view returns (uint256) {
        return ID;
    }

    function getBet(
        Stage _stage,
        uint256 _index
    ) public view returns (Bet memory) {
        return phaseBets[_stage][_index];
    }

    function hasWagerEnded() public view returns (bool) {
        return block.timestamp >= expiry;
    }

    function getWagerStage() public view returns (Stage) {
        return wagerStage;
    }
}
