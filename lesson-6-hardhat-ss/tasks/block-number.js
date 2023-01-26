//making a custom task in hardhat

const {task}=require("hardhat/config")

task("block-number", "Prints the current block number").setAction(
    async(taskArgs,hre)=>{
        //hre = hardhat runtime environment. Same thing as require hardhat
       const blockNumber= await hre.ethers.provider.getBlockNumber()
        console.log("Current block number is: "+blockNumber)
    }
)

 module.exports={}

 //tasks are better for plugins and scripts are better
 // for your own local environment