// just make sure that everything is working correctly
// on an actual testnet
const { getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const {assert} = require("chai")
developmentChains.includes(network.name)
  ? describe.skip
  //if we are not on a development chain, only then we want to do this stuff. That's why 
  // the ternary operator
  : describe("FundMe", async function() {
      let fundMe;
      let deployer;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach()(async function() {
        deployer = await getNamedAccounts().deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
        // no need to deploy because we assume it is already deployed
        // no need to deploy mocks either for the same reason
      });

      it("allows people to fund and withdraw", async function(){
        await fundMe.fund({value:sendValue})
        await fundMe.withdraw()
        const endingBalance = await fundMe.provider.getBalance(fundMe.address)
        assert.equal(endingBalance.toString(), "0")
      })
    });
