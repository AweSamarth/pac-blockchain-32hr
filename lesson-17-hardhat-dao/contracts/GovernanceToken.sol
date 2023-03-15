//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20Votes{
    uint256 public s_maxSupply = 1000000000000000000000000; //1 million * 10^18
    // 1 million is the max supply

    constructor() ERC20("GovernanceToken", "GT")
    ERC20Permit("GovernanceToken")
    {
        _mint(msg.sender, s_maxSupply);
    }

    //we need to take snapshots of tokens of people at a certain block
    // so that they don't try to rush buy tokens if they get inside-info about 
    // some proposal

     // the functions below are overrides required by solidity

     function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
     ) internal override(ERC20Votes){
        super._afterTokenTransfer(from, to, amount);
     }

     function _mint(address to, uint256 amount) internal override(ERC20Votes){
        super._mint(to, amount);

     }

     function _burn(address account, uint256 amount) internal override(ERC20Votes){
         super._burn(account, amount);
     }






    
}