const { ethers, network } = require("hardhat")

const FRONT_END_ADDRESSES_FILE = "../lesson-10-nextjs-hardhat/constants/contractAddresses.json"
const FRONT_END_ABI_FILE="../lesson-10-nextjs-hardhat/constants/abi.json"
const fs = require("fs") 
// console.log(FRONT_END_ADDRESSES_FILE)


module.exports = async function(){
    if(process.env.UPDATE_FRONT_END){
        console.log("Updating frontend")
        updateContractAddresses()

        await updateContractAddresses()
        console.log("address")
        updateAbi()
    }
}


async function updateContractAddresses(){
    const raffle = await ethers.getContract("Raffle")
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf-8"))
    const chainId = network.config.chainId.toString()
    if(chainId in currentAddresses){
        console.log("this ran")
        if(!currentAddresses[chainId].includes(raffle.address)){
            currentAddresses[chainId].push(raffle.address)
        }
    }
        else
        {
            currentAddresses[chainId] = [raffle.address]
        }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))        
    }


async function updateAbi(){
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))

}

module.exports.tags = ["all", "frontend"]