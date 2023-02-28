const {network, ethers} =  require("hardhat")

const {developmentChains} = require("../helper-hardhat-config")
const fs = require("fs")
// const {verify} = require("../utils/verify")

module.exports= async function ({getNamedAccounts, deployments}){

     const {deploy, log} = deployments
     const {deployer} = await getNamedAccounts()

    const chainId= network.config.chainId
    let ethUsdPriceFeedAddress

    if(developmentChains.includes(network.name)){
        const EthUsdAggregator = await ethers.getContract("MockV3Aggregator")
        ethUsdPriceFeedAddress = EthUsdAggregator.address

    }

    else{
        ethUsdPriceFeedAddress = networkConfig(chainId).ethUsdPriceFeed
    }

    const lowSvg = await fs.readFileSync("./images/dynamicNft/frown.svg", {encoding:"utf-8"})
    const highSvg = await fs.readFileSync("./images/dynamicNft/happy.svg", {encoding: "utf-8"})
    args= [ethUsdPriceFeedAddress, lowSvg, highSvg]

    const dynamicSvgNft = await deploy("DynamicSvgNft",{
        from:deployer,
        args:args,
        log:true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    
}

module.exports.tags= ["all", "dynamicsvg", "main"]