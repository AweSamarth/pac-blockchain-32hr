// we are doing it the manual way
// however hardhat deploy contains an api which we can easily call to 
// upgrade our contracts

const { ethers } = require("hardhat")

async function main(){
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
    // now we want the actual proxy 👇
    const transparentProxy = await ethers.getContract("Box_Proxy")
    const boxV2 = await ethers.getContract("BoxV2")
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address)
    await upgradeTx.wait(1)

    const proxyBox = await ethers.getContractAt("BoxV2", transparentProxy.address)
    const version = await proxyBox.version()
    console.log(version)    
}

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error)
    process.exit(1)
})
