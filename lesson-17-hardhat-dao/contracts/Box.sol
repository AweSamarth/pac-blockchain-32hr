//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable{
    uint256 private value;

    event ValuChanged(uint256 newValue);

    function store(uint256 newValue) public onlyOwner{
        value = newValue;
        emit ValuChanged(newValue);
    }

    function retrieve() public view returns(uint256){
        return value;
    }
}