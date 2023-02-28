// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

// in order to call a funciton using only the data field of call, we need to encode

//the function name
// the parameters we want to add
// and htose two to the binary label

// we need the function selector (first 4 bytes of function signature
// function signature is basically just the function in bytecode

contract CallAnything{
    address public s_someAddress;
    uint256 public s_amount;


    function transfer(address someAddress, uint256 amount) public{
        s_someAddress = someAddress;
        s_amount = amount;
    }

    function getSelectorOne() public pure returns (bytes4 selector){
        selector = bytes4(keccak256(bytes("transfer(address,uint256)")));

    }

    function getDataToCallTransfer(address someAddress, uint256 amount) public pure returns (bytes memory){
        return abi.encodeWithSelector(getSelectorOne(), someAddress, amount);

    }


    function callTransferFunctionDirectly(address someAddress, uint256 amount) public returns(bytes4, bool){
        (bool success, bytes memory returnData)= address(this).call(
            abi.encodeWithSelector(getSelectorOne(), someAddress, amount));

            return (bytes4(returnData), success);
        
    }
    
    function callTransferFunctionDirectlySig(address someAddress, uint256 amount) public returns(bytes4, bool){
        (bool success, bytes memory returnData) = address(this).call(abi.encodeWithSignature("transfer(address,uint256)", someAddress, amount));
        //encode with signature does the job of getting a selector itself
        return (bytes4(returnData), success);
    }

}