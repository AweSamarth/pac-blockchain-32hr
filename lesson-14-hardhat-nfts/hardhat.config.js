require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.18",
  
  networks:{
    hardhat:{
      chainId:1337
    }
  },
  solidity:{
    compilers:[
      {
        version:"0.8.18",
      }
,
      {
        version:"0.6.6",
      }
    ]
  },
  namedAccounts:{
    deployer:{
      default:0,
      1:0
    }
  }
};
