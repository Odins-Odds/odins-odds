// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*
TODO
[] find out on chain data to use (try with aavegotchi or find something else)
[] user can create bets figure out what inputes will be needed
    inputs 
        time 
        expirey
        bet options
        address

[] use should be able to make as many options as they want start with 4 for now
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

    mapping(uint256 => Wager) public wagersMap;

    constructor() {
        OdinsOwner = msg.sender;
    }

    // event BetPlaced(address indexed user, uint outcome, uint amount);

    // TODO Link wagers and bets together have an array of bets connected to it's associated wager
    struct Wager {
        uint ID;
        uint time;
        uint expirey;
        uint betChoices;
        address payable wagerCreator;
    }

    struct Bet {
        address payable bettor;
        uint outcome;
        uint256 amount;
        uint256 period;
    }

    function createWager(
        uint _time,
        uint _expiry,
        uint _betChoices
    ) public returns (Wager memory) {
        Wager memory newWager = Wager(
            nextWagerId,
            _time,
            _expiry,
            _betChoices,
            payable(msg.sender)
        );
        wagersMap[nextWagerId] = newWager;
        nextWagerId++;
        return newWager;
    }

    // function placeBet(uint outcome) public payable {
    //     require(outcome < NUM_OUTCOMES, "Invalid outcome");
    //     require(msg.value > 0, "Invalid amount");

    //     bets[msg.sender][outcome] += msg.value;
    //     totalBetsByOutcome[outcome] += msg.value;
    //     totalPool += msg.value;

    //     emit BetPlaced(msg.sender, outcome, msg.value);

    // // or make bet with struct

    // bet[betCount] = _Bet(
    //     // inputs....
    // // address payable bettor;
    // // // Outcome outcome;
    // // uint256 amount;
    // // uint256 period;
    // // )
    // }
}
