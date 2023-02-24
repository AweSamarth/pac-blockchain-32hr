const {assert} = require("chai")
const {network, deployments, ethers} = require("hardhat")
const {developmentChains} = require("../helper-hardhat-config")


!developmentChains.includes(network.name)
    ? describe.skip
    :describe("Basic NFT unit tests", function(){

        let basicNft, deployer

        beforeEach(async()=>{
            accoutns:await ethers.getSigners()
            deployer= accounts[0]
            await deployments.fixture(["basicnft"])
            basicNft = await ethers.getContract("BasicNft")
        })

        describe("Constructor", ()=>{
            //
        })




    })