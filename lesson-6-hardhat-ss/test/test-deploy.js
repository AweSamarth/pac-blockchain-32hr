// mocha framework, based on js for testing
// mocha test

//describe is a keyword recognised by mocha. It takes
// two parameters, string and a function


// these are unit tests, we will do staging tests in the next lesson

const {ethers} = require("hardhat")
const {expect, assert} = require("chai")

describe("SimpleStorage", function(){
  let simpleStorageFactory, simpleStorage

  beforeEach(async function(){
    //before each test, we want this to happen
   simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")

   simpleStorage = await simpleStorageFactory.deploy()
    //before each one of our tests, we're gonna be deploying 
    // a fresh new smart contract
  
  })

  it("Should start with a favourite number of 0", async function(){
    const currentValue = await simpleStorage.retrieve()
    const expectedValue ="0"
    assert.equal(currentValue.toString(), expectedValue)
    // we are asserting that the currentvalue should be equal to expected value
    // to run this test we use yarn hardhat test 
  })
  it("Should update when we call store", async function(){
    const expectedValue ="7"
    const transactionResponse = await simpleStorage.store(expectedValue)
    await transactionResponse.wait(1)
    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  })
  //it.only for only making that test run when we use yarn hardhat test

  //we can also use yarn hardhat test --grep keyword (the first argument of it()) to search 
  // for a keyword and then only run something that contains that keyword
})

// we use solidity coverage to check which lines of our
// solidity code have not been covered by our tests