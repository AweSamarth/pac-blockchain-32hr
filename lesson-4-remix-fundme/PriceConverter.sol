//SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//creating a library
//libraries can't have state variables
// we can't send any value to them either

// all functions need to be internal

library PriceConverter{
    function getPrice() internal view  returns(uint256){
        //address is 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        (, 
         int256 price,
         ,
         ,
         )= priceFeed.latestRoundData();
         // the latestRoundData function returns 5 values but we only need 1 that is int price
 
        return uint256(price*1e10);
        //because the price has 8 decimal places and we want 18 because
        // 1 eth = 10^18 wei

    
    }

    function getConversionRate(uint256 ethAmount) internal view returns(uint256){
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd= (ethPrice*ethAmount)/1e18;
        //always multiply before dividing because Solidity doesn't function
        //very well with floating point numbers
        return ethAmountInUsd;
    }


    function getVersion() internal view returns(uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        return priceFeed.version();
    }

}