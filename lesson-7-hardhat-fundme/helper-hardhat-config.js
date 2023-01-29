const networkConfig = {
    5:{
        //because the chainId of goerli is 5
        name:"goerli", 
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },

    137:{
        name:"polygon",
        ethUsdPriceFeed:"0x0715A7794a1dc8e42615F059dD6e406A6594651A"

    }
    // 31337

}

const DECIMALS= 8
const INITIAL_ANSWER = 200000000
const developmentChains = ["hardhat", "localhost"]
module.exports={
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
}