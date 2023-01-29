// unit tests are done locally

// we absolutely need to do these

// we can use local hardhat networks
// or forked hardhat network

const { deployments, ethers, getNamedAccounts } = require("hardhat");
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
const { assert, expect } = require("chai");

describe("FundMe", function() {
  let fundMe;
  let deployer;
  let mockV3Aggregator;
  const sendValue = ethers.utils.parseEther("25");
  console.log(sendValue);

  beforeEach(async function() {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    // for deploying all the contracts which have the specified
    // tags
    // const accounts = await ethers.getSigners()
    //ethers.getSigners will return whatever is in the accounts section in
    // the hardhat config file of the network we choose
    fundMe = await ethers.getContract("FundMe", deployer);
    // gets the most recent deployment of the
    // contract that is mentioned in ()
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", function() {
    it("sets the aggregator addresses correctly", async function() {
      const response = await fundMe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });

  describe("fund", function() {
    it("fails if you don't send enough eth", async function() {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
      // this is a feature of waffle (we can't do this in chai directly)
      // in our imports we have used chai because the expect object from waffle overwrites chai
      // the statement you need to... s predefined and we need to match it. otherwise our test will
      // break
    });

    it("updated the amount funded data structure", async function() {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });

    it("adds funder to array of funders", async function() {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.funders(0);
      assert.equal(funder, deployer);
    });
  });

  describe("withdraw", function() {
    beforeEach(async function() {
      await fundMe.fund({ value: sendValue });
    });
    it("withdraw eth from a single funder", async function() {
        //arrange, act, assert
        // we are the single funders lol
        // too real

        //arrange
        const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
        )
        const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
        )

        //act
        const transactionResponse = await fundMe.withdraw()
        const transactionReceipt = await transactionResponse.wait(1)
        const endingFundmeBalance = await fundMe.provider.getBalance(fundMe.address)
        const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

        assert.equal(endingFundMeBalance,0)
        assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString())
    });
  });
});
