const {network} = require("hardhat")

module.exports = async({getNamedAccounts, deployments})=>{

    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const ourToken = await deploy ("OurToken", {
        from: deployer,
        args:50e18,
        log:true
    })


}