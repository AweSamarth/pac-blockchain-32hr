const { network } = require("hardhat")

module.exports = async({getNamedAccounts, deployments})=>{
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    log("-----------------")

    const boxv2=await deploy("BoxV2",{
        from:deployer,
        log:true,
        args:[],
        waitConfirmations:network.config.blockConfirmations
        
    })

}