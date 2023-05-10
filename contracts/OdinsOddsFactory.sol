// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IGame.sol";

contract OdinsOddsFactory {
    address public odinsOwner;
    uint256 public nextWagerId;

    mapping(uint256 => Wager) public wagersMap;

    constructor() {
        odinsOwner = msg.sender;
    }

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
    address payable public wagerCreator;
    address gameInstance;

    Bet[] public bets;

    struct Bet {
        address payable bettor;
        uint256 outcome;
        uint256 amount;
        uint256 period;
    }

    constructor(
        address _gameContract,
        uint256 _gameId,
        uint256 _ID,
        uint256 _unixTime,
        uint256 _expiry,
        uint256 _betChoices,
        address payable _wagerCreator
    ) {
        gameContract = _gameContract;
        gameID = _gameId;
        ID = _ID;
        time = _unixTime;
        expiry = _expiry;
        betChoices = _betChoices;
        wagerCreator = _wagerCreator;
    }

    function placeBet(uint256 _outcome) public payable {
        Bet memory newBet = Bet({
            bettor: payable(msg.sender),
            outcome: _outcome,
            amount: msg.value,
            period: 0
        });

        bets.push(newBet);
    }

    function getBet(uint256 _index) public view returns (Bet memory) {
        return bets[_index];
    }

    function hasWagerEnded() public view returns (bool) {
        return block.timestamp >= time;
    }
}
