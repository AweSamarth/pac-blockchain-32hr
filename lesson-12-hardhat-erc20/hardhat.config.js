/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  networks:{
    goerli:{
      url: GOERLI_RPC_URL, //not added here
      accounts: [My_PRIVATE_KEY],
      chainId: 5
    }
  },

  namedAccounts:{
    deployer:{
      default:0,
      1:0 //1 means mainnet, 0 means the account that will be used
    }
  }
};
