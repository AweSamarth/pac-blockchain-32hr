require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.17",
  
  networks:{
    hardhat:{
      chainId:1337
    }
  },

  namedAccounts:{
    deployer:{
      default:0,
      1:0
    }
  }
};
