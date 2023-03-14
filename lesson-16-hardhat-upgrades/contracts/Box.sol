// Implementation contract (logic)
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Box{

    uint256 internal value; //it is at storage slot 0
    event ValueChanged(uint256 newValue);
    function store(uint256 newValue) public{
        value= newValue;
        emit ValueChanged(newValue);
    }


    function retrieve() public view returns(uint256)
    {
        return value;
    }

    function version() public pure returns(uint256){
        return 1;
    }
}