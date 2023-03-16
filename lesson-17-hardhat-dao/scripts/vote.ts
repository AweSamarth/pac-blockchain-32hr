import * as fs from "fs"
//@ts-ignore
import { network, ethers } from "hardhat"
import { developmentChains, proposalsFile, VOTING_PERIOD } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"


const index = 0

async function main(proposalIndex:number){
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    const proposalId = proposals[network.config.chainId!][proposalIndex]
    // 0 will be against vote
    // 1 will be for
    // 2 will be abstain
    const voteWay =1
    const reason = "yo mom"
    const governor = await ethers.getContract("GovernorContract")
    const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason)
    
    await voteTxResponse.wait(1)
    if (developmentChains.includes(network.name)){
        await moveBlocks(VOTING_PERIOD+1)
    }
    console.log("Voted! Ready to go!" )

    // it's gonna give us state 4 : that is proposal succeeded since we are the only voters
    

}

main(index)
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error)
    process.exit(1)

})