import { useWeb3Contract } from "react-moralis/";
import { abi, contractAddresses } from "@/constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
    const dispatch = useNotification()

  const { chainId: chainIdHex, isWeb3Enabled, Moralis } = useMoralis();
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("")
  
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });
  //it gets returned in hex and we want in in integer
  console.log(parseInt(chainIdHex));
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUi() {
    const entranceFeeFromContract = (await getEntranceFee()).toString();
    const numPlayersFromContract = (await getNumberOfPlayers()).toString();
    const recentWinnerFromContract = (await getRecentWinner()).toString()
    setRecentWinner(recentWinnerFromContract)
    setNumPlayers(numPlayersFromContract) 
    setEntranceFee(entranceFeeFromContract);
    console.log(ethers.utils.formatUnits(entranceFeeFromContract, "ether"));
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      //try to read raffle entrance fee


      updateUi();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function(tx){
    await tx.wait(1)
    handleNewNotification(tx)
    updateUi()
  }



  const handleNewNotification = function (){
    dispatch({
        type:"info",
        message:"Transaction complete!",
        title: "Transaction Notification",
        //position is required lol learnt that the hard way
        position:"topR",
        icon:"bell"

    })
  }

  return (
    <div className="p-5">
      <div>Hi from LotteryEntrance</div>
      {raffleAddress ? (
        <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" onClick={async function(){await enterRaffle({
            onSuccess:handleSuccess,
            onError: (error)=>console.log(error)
        })}}> {isLoading||isFetching ?(<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>):("Enter raffle")}</button>
       <div>{ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
        
        <div>Number of Players: {numPlayers}<br />
        Recent Winner: {recentWinner}
        </div>
       
        </div>
      ) : (
        <div> No raffle address detected </div>
      )}
    </div>
  );
}
