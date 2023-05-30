// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// // TODO make this actually work should return winner
// // TODO should have getter function takes in game ID and returns winner or status
// // TODO make the event work that updates the wager state

contract Game {
    uint256 public gameCount;

    mapping(uint256 => GameData) public games;

    event GameResult(uint256 indexed gameId, GameStatus status);

    enum GameStatus {
        Pending,
        RedWins,
        BlueWins
    }

    struct GameData {
        uint256 ID;
        GameStatus status;
    }

    function createGame() public {
        games[gameCount++] = GameData(gameCount, GameStatus.Pending);
    }

    // true red wins false blue wins
    function decideWinner(uint256 gameId, bool _winner) public {
        require(gameId < gameCount, "Game not found");
        require(
            games[gameId].status == GameStatus.Pending,
            "Game already decided"
        );

        if (_winner == true) {
            games[gameId].status = GameStatus.RedWins;
        } else {
            games[gameId].status = GameStatus.BlueWins;
        }

        emit GameResult(gameId, games[gameId].status);
    }

    // function getGameResult(uint256 gameId) external view returns (GameStatus) {
    //     require(gameId < gameCount, "Game not found");
    //     return games[gameId].status;
    // }
    
}

// pragma solidity ^0.8.9;

// contract Game {
//     uint256 public gameCount;

//     mapping(uint256 => GameData) public games;

//     event GameResult(uint256 indexed gameId, GameStatus status);

//     enum GameStatus {
//         Pending,
//         RedWins,
//         BlueWins
//     }

//     GameStatus public status;

//     struct GameData {
//         uint256 ID;
//         GameStatus status;
//     }

//     function createGame() public {
//         games[gameCount++] = GameData(gameCount, GameStatus.Pending);
//     }

//     // true red wins false blue wins
//     function decideWinner(uint256 gameId, bool _winner) public {
//         require(gameId < gameCount, "Game not found");
//         require(
//             games[gameId].status == GameStatus.Pending,
//             "Game already decided"
//         );

//         if (_winner == true) {
//             games[gameId].status = GameStatus.RedWins;
//         } else {
//             games[gameId].status = GameStatus.BlueWins;
//         }

//         emit GameResult(gameId, games[gameId].status);
//     }

//     function getGameResult(
//         uint256 gameId
//     ) external view returns (uint256 winningTeam) {
//         return status;
//     }
// }

// contract Game {
//     uint256 public gameID;

//     function GetGameResult(
//         uint256 _gameID
//     ) public pure returns (string memory) {
//         if (_gameID == 0) {
//             return "red";
//         } else {
//             return "blue";
//         }
//     }
// }
