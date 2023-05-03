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

[] locking mechanism for users to deposit into option the want to bet on
[] add chunks of time that users can bet
[] time based distrebution mecanism 
[] liqudity pool
[] distrabution 40%, 30%, 20%, 10%
    choose winning group option
    math for time period distrabution
*/
//contracts/mocks/IDAOmock.sol
import "./mocks/IDAOmock.sol";

contract OdinsOdds is IDAOmock {
    address OdinsOwner;

    uint public constant NUM_PERIODS = 4;
    uint256[4] public REWARD_PERCENTAGES = [40, 30, 20, 10];
    uint256 public nextWagerId;
    Bet[] public bet;

    mapping(uint256 => Wager) public wagersMap;

    constructor() {
        OdinsOwner = msg.sender;
    }

    // event BetPlaced(address indexed user, uint outcome, uint amount);

    struct Wager {
        uint ID;
        uint time;
        uint expirey;
        uint betChoices;
        address payable wagerCreator;
        Bet[] bets;
    }

    struct Bet {
        address payable bettor;
        uint outcome;
        uint256 amount;
        uint256 period;
    }

    enum Stage {
        beginning,
        middle,
        end
    }

    function createWager(
        uint _time,
        uint _expiry,
        uint _betChoices
    ) public returns (uint256) {
        Wager storage newWager = wagersMap[nextWagerId];
        newWager.ID = nextWagerId;
        newWager.time = _time;
        newWager.expirey = _expiry;
        newWager.betChoices = _betChoices;
        newWager.wagerCreator = payable(msg.sender);
        nextWagerId++;

        return newWager.ID;
    }

    function placeBet(
        uint _outcome,
        uint _wager,
        uint256 _amount
    ) public payable {
        require(wagersMap[_wager].ID == _wager, "Wager not found");

        Bet memory newBet = Bet({
            bettor: payable(msg.sender),
            outcome: _outcome,
            amount: _amount,
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
}
