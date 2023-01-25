import {ethers} from "ethers"
import * as fs from "fs-extra"
require("dotenv").config()



async function main(){
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(encryptedJson, process.env.PRIVATE_KEY_PASSWORD)
    wallet = await wallet.connect(provider)
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    //readfilesync because we want it to finish first 
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)  
    console.log("Deploying, please wait...");
    const contract = await contractFactory.deploy({gasLimit:100000000000})

    //if we don't use await, we'll get a promise instead of an object
    // we need async for await
    const deploymentReceipt = await contract.deployTransaction.wait(1)
    //wait for 1 block confirmation
    
    console.log(contract)


}

main()
    .then(()=>process.exit(0))
    .catch((error)=>{
        console.error(error);
        process.exit(1);
    })