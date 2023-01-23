//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

error NotOwner();
// notice that this is outside the contract

contract FundMe{
    using PriceConverter for uint256;
    uint256 something;
    
    address public immutable i_owner;
    //convention to name immutable variables in this format

    constructor(){
        i_owner = msg.sender;
    }

    address[] public funders;
    mapping(address=>uint256) public addressToAmountFunded;

    uint256 public number;
    uint256 public constant MINIMUM_USD = 50*1e18;
    // constant doesn't take up storage spot, they get stored directly 
    // in the bytecode of the contracts
    // convention to name constant variables in all caps and
    // separated by underscores


    function fund() public payable {

        
        //we want to set a minimum fund amount in USD  
        number =5;
        require(msg.value.getConversionRate()>=MINIMUM_USD, "aur de");
        //here, msg.value is a uint256 and since we have 
        // specified that we want to use our library for uint256 variables
        // we can just do this sort of a thing where we call functions
        // directly. Here, msg.value gets passed as the first parameter
        // of getConversionRate. we can add another variable in the brackets
        // as the second parameter had it existed in the function 
        // definition



        // require(getConversionRate(msg.value)>minimumUsd, "aur de");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
        //msg.value is in wei!

        //1e18 means 1*10**18 wei

        //reverting means undo any actions in the transaction
        //and then send the remaining gas back

        //if the transaction reverts, number = 5 won't get set
        //some gas will be lost because the statement does execute
        //it just gets reverted after it

    } 
    modifier onlyOwner(){
        // require(msg.sender==i_owner, "bhaag bhaag dk bose dk bose dk bose");
         if(msg.sender!=i_owner){
             revert NotOwner(); 
         }//this is more gas efficient than require 
        _;

    }

    function withdraw() public onlyOwner{

        for (uint256 funderIndex; funderIndex<funders.length; funderIndex++){
            address funder =funders[funderIndex];
            addressToAmountFunded[funder] = 0; 
        }

        funders = new address[](0);
        //new array of type address and we're starting with length 0

        // three different ways of sending funds FROM a contract
        // transfer
        // send
        // call

        //transfer
        payable(msg.sender).transfer(address(this).balance) ;
        // if we want to send something to some address, we need 
        // to typecast it to a payable address
        //  transfer capped at 2300 gas. If more gas is used, it throws an error

        //send
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // returns a bool (transaction sent: true , not sent: false)
        require(sendSuccess, "Send failed");
        

        //call
        (bool callSuccess,) =payable(msg.sender).call{value:address(this).balance}("");
        // here the "" is used for calling any function that we want
        // we are not putting anything here because we just want
        // to go through with the transaction without any additional
        //functions

        //call returns two values: boolean indicating success and
        // bytes with the data that is returned
  
        require (callSuccess, "Call failed");

        //call is the recommended method for sending ether
        


    }
    
    //send eth without calling the fund function
    //receive() and fallback()\

    receive() external payable{
        fund();
    }

    fallback() external payable{
        fund();
    }


}
