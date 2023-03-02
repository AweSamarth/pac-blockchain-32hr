const {network} = require("hardhat")

function sleep(timeInMs){
     return new Promise((resolve)=>setTimeout(resolve, timeInMs))

}

async function moveBlocks(amount, sleepAmount=0){
    ocnsole.log("Moving blocks...")

    for (let index=0; index<amount; index++){
        await network.provider.request({
            method:"evm_mine",
            params:[]
        })

        if(sleepAmount){
            console.log("Sleeping for "+ sleepAmount)
            await sleep(sleepAmount)
        }

    }
    console.log(`Moved ${amount} blocks`)
}

module.exxports= {
    moveBlocks,
    sleep
}