// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";



//convention, first pragma then imports then error
error FundMe__NotOwner();

// styling convention for error. Contract name two underscores, error name

//styling convention
// interfaces, libraries, contracts

// NatSpec Format: special form of comments to provide
// rich documentation for functions return variables and more
// this speical form is named the Ethereum Natural Language Specification Format
// it is inspired by doxygen

// for natspec comments we need to start with three slashes or /**  */

/**@title A contract for crowd funding
 * @notice This contract is to demo a sample funding contract
 * @dev This implements pricefeeds as our library
 */

// this will be very helpful if we want to
// generate documentation

contract FundMe {
    // style: Type Declarations
    using PriceConverter for uint256;

    mapping(address => uint256) public addressToAmountFunded;
    address[] public s_funders;

    address public immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10**18;

    AggregatorV3Interface public priceFeed;
    modifier onlyOwner() {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // receive() external payable {
    //     fund();
    // }

    // fallback() external payable {
    //     fund();
    // }

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public payable onlyOwner{
        //read the entire array and store it in memory instaed of reading at every interation of the for loop
      address[] memory funders = s_funders;  
      //mappings can't be in memory
      for(uint256 funderIndex =0;funderIndex<funders.length; funderIndex++){
        address funder = funders[funderIndex];
        addressToAmountFunded[funder]=0;
      }
      s_funders = new address[](0);
      (bool success, ) = i_owner.call{value:address(this).balance}("");

      require(success);
    }
}

//
// in storage, each slot is 32 bytes long and represents the bytes version of the object
// uint256 25 is 0x00000...19 since that is the hex representation
// for a true boolean it would be 0x0000..01 since that's its hex

//for dynamic values
// for example in arrays, only the length is stored in storage when we declare
// an array
// the elements are stored using a hashing function
// for mapping there is an empty slot
// constant and immutable do not take storage space as they are a part of the bytecode
// they are like pointers

// gas is calculated using opcodes
// for example adding costs 3 gas, multiplying costs 5 gas
// getting balance is 700
//sstore stands for storage store
//sload stands for storage load

//convention to add s_ beofre the variable name
// convention to add i_ before immutable
// convention to name constant variables in uppercase

//internal and private variables are cheaper than public variable 