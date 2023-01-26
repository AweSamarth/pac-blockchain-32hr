const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed contract to ${simpleStorage.address}`);
  // console.log(network.config)
  if (network.config.chainId===5&&process.env.ETHERSCAN_API_KEY){
    await simpleStorage.deployTransaction.wait(6) 
    await verify(simpleStorage.address, [])
  }

  const currentValue = await simpleStorage.retrieve()
  console.log("current value is: "+ currentValue)

  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()

  console.log("The updated value is: "+updatedValue)

  // might get error enoent while deploying to a testnet. Just delete 
  // artifacts and cache folders. Either do it manually or use 
  // yarn hardhat clean
}

//let's create a function for verifying our smart contract
// so that it doesn't appear as bytecode on etherscan

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    // here the first verify is our task, 
    // second verify is kind of like the sub task
    // and the thing in brackets is the set of 
    // parameters for our task
  } catch(e) {
    if(e.message.toLowerCase().includes("already verified")){
      console.log("Already Verified!")
    }
    else{
      console.log(e)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => console.error(error));


  // if we run hardhat deploy directly, it only persists for one time
  // ie. the block number resets to 0 every time
  // if we want to mimic a blockchain like ganache,
  // we need to use hardhat node. It's like ganace but in our terminal
  // it's different from the hardhat network and is just referred to as the
  // localhost. We need to create a new network in
  // our hardhat.config.js file with the url that is 
  // specified after we run hardhat node

  // we can use yarn hardhat console to create a 
  // js console environment which will allow us 
  // to do everything the deploy.js file does and more
  // using javascript lol