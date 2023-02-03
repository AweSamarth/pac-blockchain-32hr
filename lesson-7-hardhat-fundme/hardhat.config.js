require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  namedAccounts:{
    deployer:{
      default:0,
      //5:1
      //5 is the chainId (goerli)
      //1 is the index of accounts that we want to use
      // (in accounts:[....])
    },
    networks:{
      goerli:{
        url:"",
        accounts:[],
        chainId:5,
        blockConfirmations:6
      }
    },
    user:{
      default:1
      //we can create multiple users
    },

  },
  gasReporter:{
    enabled:true,
    outputFile:"gas-report.txt",
    noColors :true,
    currency: "USD",
    token:"MATIC",
  }
};
