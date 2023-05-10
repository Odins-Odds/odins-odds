// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IGame {
    function getGameResult(
        uint256 gameId
    ) external view returns (string memory winningTeam);
}
