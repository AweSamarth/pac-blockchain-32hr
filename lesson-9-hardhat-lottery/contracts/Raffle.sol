//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Raffle__NotEnoughETHEntered();
error Raffle__TransferFailed();

contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS=3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS=1;

    address private s_recentWinner; 


    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(address vrfCoordinatorV2, uint256 entranceFee, bytes32 gasLane, uint64 subscriptionId, uint32 callBackGasLimit)
        VRFConsumerBaseV2(vrfCoordinatorV2)
    {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane=  gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callBackGasLimit; 
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender));
        //we have to use the payable keyword here
        // because s_players is an array of payable
        // addresses

        //convention to name eevents with the function's name in reverse order of words
        emit RaffleEnter(msg.sender);
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }


    funciton checkUpkeep(bytes calldata checkData ) external override
    function requestRandomWinner() external {
        //  external are cheaper than public
        // first request a number
        // then do something with it
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS

            


        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords)
        internal
        override
    {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        (bool success, ) = recentWinner.call{value:address(this).balance}("");
        if(!success){
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    // in events we can have at most 3 indexed parameters
    // these are called "topics"
    // indexed parameters are more easily searchable
    // events get emitted to a data storage that is
    // outside the smart contract. That is why they are cheaper



    function getRecentWinner() public view returns(address){
         return s_recentWinner;
    }
}
