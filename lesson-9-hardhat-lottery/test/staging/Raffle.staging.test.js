const {assert, expect} = require("chai")
const {getNamedAccounts, deployments, ethers, network} = require("hardhat")
const {developmentChains, networkConfig} = require("../../helper-hardhat-config")

developmentChains.includes(network.name)?describe.skip:
describe("Raffle Unit Tests", function(){
    let raffle, raffleEntranceFee, deployer

    beforeEach(async function(){
        deployer= (await getNamedAccounts()).deployer
        raffle = await ethers.getContract("Raffle", deployer)
        raffleEntranceFee= await raffle.getEntraceFee()

    })

    describe("fulfillRandomWords", function(){
        it("works with live Chainlink Keepers and Chainlink VRF, we get a randome winner", async function(){
            const accounts = await ethers.getSigners()
            const startingTimeStamp = await raffle.getLatestTimeStamp()
            // set up a listener before we enter the raffle (should've done this in the unit test too but it 
            //doesn't really matter there as we were on our local network)
            await new Promise(async(resolve,reject)=>{
                raffle.once("WinnerPicked", async()=>{
                    console.log("WinnerPicked event fired!")
                    try {
                        const recentWinner = await raffle.getRecentWinner()
                        const raffleState = await raffle.getRaffleState()
                        const winnerEndingBalance = await accounts[0].getBalance()
                        const endingTimeStamp = await raffle.getLatestTimeStamp()
                        
                        await expect(raffle.getPlayer(0)).to.be.reverted
                        assert.equal(recentWinner.toString(), accounts[0].address)
                        assert.equal(raffleState, 0)
                        assert.equal(winnerEndingBalance.toString(), winnerStartingBalance.add(raffleEntranceFee).toString()  )
                        assert(endingTimeStamp> startingTimeStamp)
                        resolve()
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }
                })
                await raffle.enterRaffle({value:raffleEntranceFee})
                const winnerStartingBalance = await accounts[0].getBalance()
            })
        })
    })
})