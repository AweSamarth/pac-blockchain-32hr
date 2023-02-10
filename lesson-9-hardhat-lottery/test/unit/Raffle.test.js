const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name) 
? describe.skip
: describe("Raffle", function(){
    let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval
    const chainId = network.config.chainId

    beforeEach  (async function(){
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        //fixture has the tags whose contracts are to be deployed
        raffle = await ethers.getContract("Raffle", deployer)
        vrfCoordinatorV2Mock  = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        raffleEntranceFee = await raffle.getEntranceFee()
        interval = await raffle.getInterval()
    })

    describe("constructor", function(){
        it("initializes the raffle correctly", async function(){
            //ideally we have only 1 assert per it but here we are being a little bit loose

             const raffleState = await raffle.getRaffleState()
             assert.equal(raffleState.toString(), "0")
             assert.equal(interval.toString(), networkConfig[chainId]["interval"])
             
        })
    })
    describe("enterRaffle", async function(){
        it("reverts when you don't pay enough",async function(){
            await expect(raffle.enterRaffle()).to.be.revertedWith(
                "Raffle__NotEnoughETHEntered"
            )
        })

        it("records players when they enter", async function(){
            await raffle.enterRaffle({value:raffleEntranceFee})
            const playerFromContract = await raffle.getPlayer(0)

            assert.equal(playerFromContract, deployer)
        })
        it("emits event on enter", async  function(){
            await expect(raffle.enterRaffle({value:raffleEntranceFee})).to.emit(raffle, "RaffleEnter")
            //emit is from chai matchers ethereum waffle
        })

        it("doesn't allow entrance when raffle is calculating", async function(){
            await raffle.enterRaffle({value:raffleEntranceFee})
            await network.provider.send("evm_increaseTime", [interval.toNumber()+1])
            await network.provider.send("evm_mine", [])
            //increase the time and mine a block (above two lines)

            //pretend to be a chainlink keeper
            await raffle.performUpkeep([])
            await expect(raffle.enterRaffle({value:raffleEntranceFee})).to.be.revertedWith("Raffle__NotOpened")

        })
    })

    describe("checkUpkeep", function(){
        it("returns false if people haven't sent any ETH", async function(){
            await network.provider.send("evm_increaseTime", [interval.toNumber()+1])
            await network.provider.send("evm_mine", [])
            const {upkeepNeeded} = await raffle.callStatic.checkUpkeep([])
            //empty bytes object is []
             // we don't actually want to send a transaction, just wanna simulate sending a transaction
            assert(!upkeepNeeded)
        })
        
        it("returns false if raffle isn't open", async function(){
            await raffle.enterRaffle({value:raffleEntranceFee})
            await network.provider.send("evm_increaseTime", [interval.toNumber()+1])
            await network.provider.send("evm_mine", [])
            await raffle.performUpkeep("0x")   
            const raffleState = await raffle.getRaffleState()
            const {upkeepNeeded} = await raffle.callStatic.checkUpkeep([])
            assert.equal(raffleState.toString(),"1")
            assert.equal(upkeepNeeded, false)    
        })
    })

    describe("performUpkeep", function(){
        it("can only run if checkupkeep is true", async function(){
            await raffle.enterRaffle({value:raffleEntranceFee})
            await network.provider.send("evm_increaseTime", [interval.toNumber()+1])
            await network.provider.send("evm_mine", [])
            const tx = await raffle.performUpkeep([])
            assert(tx)
        })
        it("reverts when checkupkep is false", async function(){
            await expect(raffle.performUpkeep([])).to.be.revertedWith("Raffle__UpkeepNotNeeded")
        })

        it("updates the raffle state, emits an event, and calls the vrf coordinator", async function(){
            await raffle.enterRaffle({value:raffleEntranceFee})
            await network.provider.send("evm_increaseTime", [interval.toNumber()+1])
            await network.provider.send("evm_mine",[])
            const txResponse=await raffle.performUpkeep([])
            const txReceipt= await txResponse.wait(1)
            const requestId = txReceipt.events[1].args.requestId
            const raffleState = await raffle.getRaffleState()
            assert(requestId.toNumber()>0)
            assert(raffleState.toString()=="1")
        })
    })

    describe("fulfillRandomWords", function(){
        beforeEach(async function(){
            await raffle.enterRaffle({value:raffleEntranceFee})
            await network.provider.send("evm_increaseTime", [interval.toNumber() +1])
            await network.provider.send("evm_mine", [])
        })
        it("can only be called after performUpkeep", async function(){
            await expect(vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)).to.be.revertedWith("nonexistent request")
            await expect(vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)).to.be.revertedWith("nonexistent request")
              
        })
        it ("picks a winner, resets the lottery, and sends money", async function(){
            const accounts=await ethers.getSigners()
            const additionalEntrants =3
            //we'll have some fake accounts (from ethers) enter our lottery
            const startingAccountIndex=1
            //since the deployer's account is 0
            for(let i = startingAccountIndex; i<startingAccountIndex+additionalEntrants;i++){
                const accountConnectedRaffle=raffle.connect(accounts[i])
                await accountConnectedRaffle.enterRaffle({value:raffleEntranceFee})
                 
            }
            const startingTimeStamp = await raffle.getLatestTimeStamp()
            //we want to perform upkeep which will kick off fulfill randomwords
            await new Promise(async(resolve,reject)=>{
                raffle.once("WinnerPicked", async()=>{
                    //setting up a listener for the even WinnerPicked 
                    // once the event is detected do something
                    console.log("Found the event")
                    try {
                        
                        const recentWinner = await raffle.getRecentWinner()
                        console.log(recentWinner)
                        const raffleState = await raffle.getRaffleState()
                        const endingTimeStamp = await raffle.getLatestTimeStamp() 
                        const numPlayers = await raffle.getNumberOfPlayers()
                        assert.equal(numPlayers.toString(), "0")
                        assert.equal(raffleState.toString(),"0")
                        assert(endingTimeStamp>startingTimeStamp)
                        
                    } catch (error) {
                        reject(error)
                    }
                    resolve()
                }) 
                const tx = await raffle.performUpkeep([])
             
                const txReceipt = await tx.wait(1)
                await vrfCoordinatorV2Mock.fulfillRandomWords(txReceipt.events[1].args.requestId, raffle.address)    
            })
        })
    })
});
