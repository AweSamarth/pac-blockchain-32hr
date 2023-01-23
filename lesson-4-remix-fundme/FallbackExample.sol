//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract FallbackExample{
    uint256 public result;

     receive() external payable{
        result =1 ;
    }
    //receive and fallback are special functions in 
    // Solidity. They are defined without using the 
    // function keyword. They come into play 
    // when someone tries sending a transaction to our smart
    //contract.
    // constructor is also a special function

    //for receive, calldata has to be blank
    // otherwise fallback needs to come into play

    fallback() external payable {
        result =2;
    }

    //fallback always receives data but if it has to receive
    // ether, it has to be made payable
    
    // we can send transactions to our 
    // smart contract in remix using the 
    // transact button and giving some value inte 
    // value section. calldata can be left blank. 
    // It will be equivalent to sending some eth
    // to someone using metamask

    

}