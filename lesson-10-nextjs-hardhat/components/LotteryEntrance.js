import { useWeb3Contract } from "react-moralis/";
import { abi, contractAddresses } from "@/constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled, Moralis } = useMoralis();
  const [entranceFee, setEntranceFee] = useState("0");
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const { runContractFunction: enterRaffle } = useWeb3Contract({
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

  useEffect(() => {
    if (isWeb3Enabled) {
      //try to read raffle entrance fee

      async function updateUi() {
        const entranceFeeFromContract = (await getEntranceFee()).toString();
        setEntranceFee(entranceFeeFromContract);
        console.log(ethers.utils.formatUnits(entranceFeeFromContract, "ether"));
      }
      updateUi();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      <div>Hi from LotteryEntrance</div>
      {raffleAddress ? (
        <div>
        <button onClick={async function(){await enterRaffle()}}>Enter raffle</button>
        <div>{ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
        </div>
      ) : (
        <div> No raffle address detected </div>
      )}
    </div>
  );
}
