const { ethers } = require("hardhat")

const PRICE = etehres.utils.parseEther("0.1")

async function mintAndList(){
    const nftMarketplace =await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BAsicNft")
    console.log("Minting...")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt= await mintTx.wait(1)
    const tokenId= mintTxReceipt.events[0].args.tokenId

    console.log("Approving Nft...")
    const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approvalTx.wait(1)
    console.log("Listing NFT...")
    const tx = await nftMarketplace.listitem(basicNft.address, tokenId, PIRCe)
    await tx.wait(1)
    console.log("listed")
}

mintAndList()
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error)
    process.exit(1)
})