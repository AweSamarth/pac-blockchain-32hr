//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Raffle__NotEnoughETHEntered();
error Raffle__TransferFailed();
error Raffle__NotOpened();
error Raffle__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 raffleState);

contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    enum RaffleState {
        OPEN,
        CALCULATING
        //0 IS OPEN, 1 IS CALCULATING
    }

    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    address private s_recentWinner;
    RaffleState private s_raffleState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callBackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callBackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__NotOpened();
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

    function checkUpkeep(
        bytes memory /*checkData*/
        //calldata doesn't work with strings, so we have to use memory instead since we are passing an empty string
        // anyway. We are passing it in the funciton performUpkeep.
    ) public override returns(bool upkeepNeeded, bytes memory/*performDate*/) {
        bool isOpen = (RaffleState.OPEN == s_raffleState);
        bool timePassed = ((block.timestamp - s_lastTimeStamp)>i_interval);
        bool hasPlayers = (s_players.length>0);
        bool hasBalance = address(this).balance>0;
        upkeepNeeded = (isOpen&&timePassed&&hasPlayers&& hasBalance);

        
   
    }

    

    function performUpkeep(bytes calldata /*performData*/) external override {
        //  external are cheaper than public 
        // first request a number
        // then do something with it
        (bool upkeepNeeded,) = checkUpkeep("");
        if (!upkeepNeeded){
            revert Raffle__UpkeepNotNeeded(address(this).balance, s_players.length, uint256(s_raffleState));
        }
        s_raffleState = RaffleState.CALCULATING;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256, /*requestId*/
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    // in events we can have at most 3 indexed parameters
    // these are called "topics"
    // indexed parameters are more easily searchable
    // events get emitted to a data storage that is
    // outside the smart contract. That is why they are cheaper

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() public view returns (RaffleState){
        return s_raffleState;
    }

    function getNumWords() public view returns (uint256){
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view returns(uint256){
        return s_players.length;
    }

    function getLatestTimeStamp() public view returns(uint256){
        return s_lastTimeStamp;
    }

    function getRequestConfirmations() public pure returns(uint256){
        return REQUEST_CONFIRMATIONS;
    }

    function getInterval() public view returns(uint256){
        return i_interval;
    }


}

