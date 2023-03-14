// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

// it is best practice to make an admin contract instead of 
// making an admin address

contract BoxProxyAdmin is ProxyAdmin{
    constructor(
        address

    ) ProxyAdmin(){

        
    }
}