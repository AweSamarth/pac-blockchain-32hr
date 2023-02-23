const {getNamedAccounts, ethers, network} = require("hardhat")

const AMOUNT = ethers.utils.parseEther("0.02")


async function getWeth(){

    const {deployer} = await getNamedAccounts()
    // call the ddeposit funciton on the weth contract
    // so we need the abi and the ocntract address of weth.
    //0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    console.log(deployer)
    const iWeth = await ethers.getContractAt("IWeth","0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", deployer)
    // with the abi of IWeth, at the address of 0xc02.... connected too deployer
    const tx = await iWeth.deposit({value:AMOUNT})
    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH` )


}

module.exports= {getWeth, AMOUNT}