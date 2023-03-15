// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
// timelock is actually gonna be the owner of the box contract
// time between a proposal passing and it getting executed
import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
    // mindelay is how long you have to wait before executing a proposal once it's passed
    //proposers in out case is gonna be everyone
}
