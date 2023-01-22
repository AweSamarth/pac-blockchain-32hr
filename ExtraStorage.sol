//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// inheritance

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage{
    //even if we deploy without the below code,
    // we'll successfully deploy a contract which 
    // is just the same as our SimpleStorage contract

    function store(uint256 _favouriteNumber) public override{
        favoriteNumber = _favouriteNumber+5;
    //we can only override virtual functions
    }
}