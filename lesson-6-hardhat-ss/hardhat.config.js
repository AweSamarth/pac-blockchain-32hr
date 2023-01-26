require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("./tasks/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage")

// /** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://eth-goerli/example"
const PRIVATE_KEY=process.env.PRIVATE_KEY ||"0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key" 
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY|| "key"
module.exports = {
  //defaultNetwork:hardhat
  //already includes private key and rpc url for it
  solidity: "0.8.17",
  networks:{
    goerli:{
      url:GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId:5
    },
    localhost:{
      url:"http://127.0.0.1:8545/",
      // accounts: already given by runnning hardhat node (the 10 fake accounts)
      chainId:31337,
      //same chainId as hh network even though they are different

    }
  },
  etherscan:{
    apiKey:ETHERSCAN_API_KEY
  },
  gasReporter:{
    enabled:false,
    outputFile:"gas-report.txt",
    noColors:true,
    currency:"USD",
    // coinmarketcap: COINMARKETCAP_API_KEY
    // token:"MATIC"
  }
};


