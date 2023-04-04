// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract IDAOmock {
    function isConfirmed(bool vote) public pure returns (bool) {
        return vote;
    }

    /// @dev Returns the confirmation status of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Confirmation status.
    // function isConfirmed(uint transactionId) public constant returns (bool) {
    //     uint count = 0;
    //     for (uint i = 0; i < owners.length; i++) {
    //         if (confirmations[transactionId][owners[i]]) count += 1;
    //         if (count == required) return true;
    //     }
    // }
}
