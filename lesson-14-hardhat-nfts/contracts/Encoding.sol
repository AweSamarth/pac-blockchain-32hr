// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract Encoding{
    function combineStrings() public pure returns (string memory){
       
        return string(abi.encodePacked("Hi there ", "Miss you!"));
    }

    function encodeNumber() public pure returns(bytes memory){
        bytes memory number = abi.encode(1);
        return number;
        //encode it down to its binary number
    }

    function encodeString() public pure returns(bytes memory){
        bytes memory someString = abi.encode("some string");
        return someString;
    }

    // there are a lot of leading and trailing zeros, which take space
    // when we use abi.encode
    // abi.encodePacked helps to strip those zeros off
    // it compresses that stuff.


    function encodeStringPacked() public pure returns(bytes memory){
        bytes memory someString = abi.encodePacked("some string");
        return someString;
    }

    function decodeString() public pure returns(string memory){
        string memory someString = abi.decode(encodeString(),(string));
        return someString;

        //we give it the result of the function encodeString and ask
        // it to decode it to a string type
        // we get back some string
    }

    function multiEncode() public pure returns (bytes memory){
        bytes memory someString = abi.encode("some string", "it's bigger!");
        return someString;
    }

    function multiDecode() public pure returns (string memory, string memory){
        (string memory someString, string memory someOtherString) = abi.decode(multiEncode(), (string, string));
        return (someString, someOtherString);
    }

    //decoding packed doesn't work unfortunately
    // it will give an error

    // so we'll have to typecast instead. 

     

     //we use call for calling function that change the state of the blockchain
     // we use staticcall for calling view and pure functions on the blockchain
     // send and delegateCall are there

    

}
