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

interface IDAO {
    function isConfirmed(uint transactionId) external view returns (bool);

    function getOwners() external view returns (address[] memory);
}

contract OdinsOdds {
    address OdinsOwner;

    IDAO public daoContract;

    // aavegochi DAO polygon address 0xb208f8BB431f580CC4b216826AFfB128cd1431aB
    constructor(address _daoContractAddress) {
        daoContract = IDAO(_daoContractAddress);
    }

    function checkVoteStatus(
        uint transactionId
    ) public view returns (string memory) {
        if (daoContract.isConfirmed(transactionId)) {
            return "Transaction has enough confirmations and can be executed.";
        } else {
            return "Transaction has not yet received enough confirmations.";
        }
    }

    uint public constant NUM_PERIODS = 4;
    uint256[4] public REWARD_PERCENTAGES = [40, 30, 20, 10];

    event BetPlaced(address indexed user, uint outcome, uint amount);

    // TODO Link wagers and bets together have an array of bets connected to it's associated wager
    struct Wager {
        uint time;
        uint expirey;
        uint betChoices;
        address payable wagerCreator;
        //Bets
    }

    Wager[] public Wagers;

    struct Bet {
        address payable bettor;
        uint outcome;
        uint256 amount;
        uint256 period;
    }

    constructor() {
        OdinsOwner = msg.sender;
    }

    function createWager(
        uint _time,
        uint _expiry,
        uint _betChoices
    ) public returns (Wager memory) {
        Wager memory newWager = Wager(_time, _expiry, _betChoices, msg.sender);
        wager.push(Wager);
        return newWager;
    }

    function placeBet(uint outcome) public payable {
        require(outcome < NUM_OUTCOMES, "Invalid outcome");
        require(msg.value > 0, "Invalid amount");

        bets[msg.sender][outcome] += msg.value;
        totalBetsByOutcome[outcome] += msg.value;
        totalPool += msg.value;

        emit BetPlaced(msg.sender, outcome, msg.value);

        // // or make bet with struct

        // bet[betCount] = _Bet(
        //     // inputs....
        // // address payable bettor;
        // // // Outcome outcome;
        // // uint256 amount;
        // // uint256 period;
        // // )
    }
}
