// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//contracts/mocks/IDAOmock.sol
import "./mocks/IDAOmock.sol";

contract OdinsOdds is IDAOmock {
    address OdinsOwner;

    uint public constant NUM_PERIODS = 4;
    uint256[4] public REWARD_PERCENTAGES = [40, 30, 20, 10];
    uint256 public nextWagerId;
    uint256 public userTimestamp;
    Bet[] public bet;

    mapping(uint256 => Wager) public wagersMap;

    constructor() {
        OdinsOwner = msg.sender;
    }

    // event BetPlaced(address indexed user, uint outcome, uint amount);

    struct Wager {
        uint256 ID;
        uint256 time;
        uint256 expirey;
        uint256 betChoices;
        address payable wagerCreator;
        Bet[] bets;
    }

    struct Bet {
        address payable bettor;
        uint256 outcome;
        uint256 amount;
        uint256 period;
    }

    enum Stage {
        beginning,
        middle,
        end
    }

    function createWager(
        uint256 _unixTime,
        uint256 _expiry,
        uint256 _betChoices
    ) public returns (uint256) {
        Wager storage newWager = wagersMap[nextWagerId];
        newWager.ID = nextWagerId;
        newWager.time = _unixTime;
        newWager.expirey = _expiry;
        newWager.betChoices = _betChoices;
        newWager.wagerCreator = payable(msg.sender);
        nextWagerId++;

        return newWager.ID;
    }

    function placeBet(uint256 _outcome, uint256 _wager) public payable {
        require(wagersMap[_wager].ID == _wager, "Wager not found");

        Bet memory newBet = Bet({
            bettor: payable(msg.sender),
            outcome: _outcome,
            amount: msg.value,
            period: 0
        });

        wagersMap[_wager].bets.push(newBet);
    }

    function getBet(
        uint256 _wagerId,
        uint256 _index
    ) public view returns (Bet memory) {
        return wagersMap[_wagerId].bets[_index];
    }

    // check time in wager mapping
    function hasWagerEnded(uint256 _wagerID) public view returns (bool) {
        return block.timestamp >= wagersMap[_wagerID].time;
    }

    // ============ Private Functions ============

    // frontend needs function that converts regular time to Unix Epoch time
    function setUserTimestamp(uint256 _userTimestamp) private {
        userTimestamp = _userTimestamp;
    }
}
