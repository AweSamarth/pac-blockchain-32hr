// function deployFunc(hre){
//     console.log("hi")
// }

const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const {network} = require("hardhat")

module.exports=async ({getNamedAccounts, deployments})=>{
    // we are pulling getNamedAccounts and deployments from hre (hardhat runtime environment)
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId= network.config.chainId

    //if chain id is 4, use some address for the 
    // price feed. If it is 5, use some other
    // address for the price feed. 

    // const ethUsdPriceFeedAddress =networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address

    }
    else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    //


    //mocking: if the contract doesn't exist on some chain, we deploy
    // a minimal version of it just for testing locally


    const fundMe = await deploy("FundMe",{
        from:deployer,
        args:[ethUsdPriceFeedAddress],
        log:true,
        //for the price feed address
        waitConfirmations:network.config.blockConfirmations || 1
    })
    log("----------------------------")

}

module.exports.tags=["all", "fundme"]
// module.exports.default=deployFunc
//we need this line because hardhat deploy looks 
// for a function to run in the files in our deploy
// folder

// if we run a node (yarn hardhat node) after deploying
// something, the deployments are gonna be recorded to the localhost network as 
// well