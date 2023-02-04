import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";

//"require" statements don't work in frontend js. They
// work in nodejs. We need to use imports here from cdn

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton")
const withdrawButton =document.getElementById("withdrawButton")


// we need to do this instead of writing onclick = connectbutton etc because
// we need this to be a module and we can't do such a thing in modules
// it has to be a module because we are importing ethers which is not possible
// in a regular text/javascript type file

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick= getBalance
withdrawButton.onclick = withdraw
// no brackets here

console.log(ethers);
async function connect() {
  console.log("connecting");
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
    connectButton.innerHTML = "Connected";
  } else {
    connectButton.innerHTML = "Please install metamask!";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log("Mining" + transactionResponse.hash + "...");

  return new Promise((resolve, reject) => {
    // we need to create a listener for the blockchain
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function getBalance(){
    if(typeof window.ethereum != "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance =await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw(){
    if(typeof window.ethereum != "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
       const signer = provider.getSigner()
       const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
        const transactionResponse  = await contract.withdraw()
        await listenForTransactionMine(transactionResponse, provider)

    } catch (error) {
        console.log(error)
    }
    }
}