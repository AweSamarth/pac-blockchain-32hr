//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/Proxy.sol";

contract SmallProxy is Proxy{

    bytes32 private constant _IMPLEMENTATION_SLOT="";

    function setImplementation(address newImplementation) public{
        assembly{
            sstore(_IMPLEMENTATION_SLOT, newImplementation)
        }
    }

    function _implementation() internal view override returns(address implementationAddress){
        assembly{
            implementationAddress :=sload(_IMPLEMENTATION_SLOT)
        }
    }

    // we're writing in Yul which is kinda like an inline assembly
    // use as little yul as possible becuase it is much easier to screw things up 
     

    function getDataToTransact(uint256 numberToUpdate) public pure returns(bytes memory){
        return abi.encodeWithSignature("setValue(uint256)", numberToUpdate);

    }

    function readStorage() public view returns(uint256 valueAtStorageSlotZero){
        assembly{
            valueAtStorageSlotZero :=sload(0)
        }
    }


}


contract ImplementationA{
    uint256 public value;

    function setValue(uint256 newValue) public{
        value= newValue;
    }

}

contract ImplementationB{
    uint256 public value;

    function setValue(uint256 newValue) public{
        value= newValue+2;
    }

} 


