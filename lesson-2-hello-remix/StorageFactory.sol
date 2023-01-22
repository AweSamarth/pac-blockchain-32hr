//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./SimpleStorage.sol";

contract StorageFactory{
    SimpleStorage[] public simpleStorageArray; 
    
    function createSimpleStorageContract() public{
        // simpleStorage = new SimpleStorage();
        // for creating a new instance of our SimpleStorage contract
        // we'll use simpleStorage for accessing it
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage); 

    }

    function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public{
        // we're always gonna need the address of the contract and 
        // the abi of the contract we want to interact with

        // we already have both here since we're 
        //1) storing addresses in the array
        //2) importing the contract directly so we have the abi

        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
        simpleStorage.store(_simpleStorageNumber);

    }


        function sfGet(uint256 _simpleStorageIndex) public view returns(uint256){
        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];

        return simpleStorage.retrieve();
    }
}
