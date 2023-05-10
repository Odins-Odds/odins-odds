// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Game {
    uint256 public gameID;

    function GetGameResult(uint256 _gameID) public returns (string memory) {
        gameID = _gameID;
        if (gameID == 0) {
            return "red";
        } else {
            return "blue";
        }
    }
}
