//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract SafeMathTester{
    uint8 public bigNumber = 255;

    function adder() public{
        bigNumber = bigNumber+1;
        // this will break things since the pragma of Solidity is before 0.8
        // this will cause an overflow and we need(ed) to use the 
        //SafeMath library or other alternatives 
        // to prevent such things from happening. Soidity 0.8.x onwards,
        // however, SafeMath became a part of Solidity itself

        //we can still do the old wwrap around thing on purpose
        // if we want to by using the unchecked keyword
        // for example
        // unchecked {bigNumber = bigNumber +1; }

        // if, now in modern versions we know that our value won't ever go
        // above or below the limits, we can use the unchecked keyword
        // in order to save some gas
        
    } 

}