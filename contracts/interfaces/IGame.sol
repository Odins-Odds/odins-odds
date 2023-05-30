pragma solidity ^0.8.9;

interface IGame {
    enum GameStatus {
        Pending,
        RedWins,
        BlueWins
    }

    function getGameResult(
        uint256 gameId
    ) external view returns (IGame.GameStatus);
}

// pragma solidity ^0.8.9;

// interface IGame {
//     enum GameStatus {
//         Pending,
//         RedWins,
//         BlueWins
//     }

//     // function games(
//     //     uint256 gameId
//     // ) external view returns (uint256 ID, GameStatus status);

//     function getGameResult(
//         uint256 gameId
//     ) external view returns (string memory winningTeam);
// }
