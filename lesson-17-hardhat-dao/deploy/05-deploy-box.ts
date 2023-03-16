import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
//@ts-ignore
import {ethers} from "hardhat"
const deployBox: DeployFunction = async function (hre:HardhatRuntimeEnvironment){
    //@ts-ignore
    const {getNamedAccounts,deployments} = hre
    const {deploy, log, get} = deployments
    const {deployer} = await getNamedAccounts()

    log("Deplooying Box...")
    const box = await deploy("Box", {
        from:deployer,
        args:[],
        log:true
    })

    const timeLock = await ethers.getContract("TimeLock")
    const boxContract = await ethers.getContractAt("Box", box.address)
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address)


    await transferOwnerTx.wait(1)
    log("Done!")
}
 
export default deployBox

//timelock owns the governance process
//no one owns timelock
//timelock owns the box contract too
