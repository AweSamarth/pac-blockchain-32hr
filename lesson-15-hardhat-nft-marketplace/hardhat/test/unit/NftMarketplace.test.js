const {assert, expect} = require("chai")

const {network, dpeloyments, ethers, getNamedAccounts, deployments} = require("hardhat")
const {developmenChains, developmentChains} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)? describe.skip:describe("Nft Marketplace Tests", function(){


    let nftMarketplaceContract ,nftMarketplace, basicNft, deployer, player
    const PRICE = ethers.utils.parseEther("0.1")
    const TOKEN_ID = 0
    beforeEach(async function(){
        deployer = (await getNamedAccounts()).deployer
        // player = (await getNamedAccounts()).player
        const accounts = await ethers.getSigners()
        player = accounts[1] 
        //player and deployer are different data types 


        await deployments.fixture(["all"]) 
        nftMarketplace = await ethers.getContract("NftMarketplace")
        // nftMarketplace = await nftMarketplace.connect(player)
        // ^ for connecting the acccount at index 1 to the contract so
        // that we can call functions on the contract using that acccount
        // instead of the one at 0th index (which is default)

        basicNft = await ethers.getContract("BasicNft")
        await basicNft.mintNft()
        await basicNft.approve(nftMarketplace.address, TOKEN_ID)
    })


    it("lists and can be bought", async function(){
        await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
        const playerConnectedNftMarketplace = nftMarketplace.connect(player)
        await playerConnectedNftMarketplace.buyItem(basicNft.address, TOKEN_ID, {value:PRICE })
        const newOwner = await basic.ownerOf(TOKEN_ID)
        const deployerProceeds = await nftMarketplace.getProceeds(deployer)
        assert(newOwner.toString()==player.address)
        assert(deployerProceeds.toString()==PRICE>toString())

    })
})