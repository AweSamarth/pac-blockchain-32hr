//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

//^ vs >= : the patch version should be the same for ^ (backwards compatible change))

contract Practice1{
    bool hasFavouriteNumber;
    //true or false


    uint8 favoriteNumber = 123;
    
    //this automatically chooses uint256, so it is much better to 
    //specify the lowest power of 2 (here in this case it is 8 because
    // 123 is smaller than 2^8

    string favouriteNumberInText="4";
    address Address = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    // no quotes here!
    bytes3 cat= "cat";
    //max can be bytes32
    bytes something = "some other thing";

    uint256 public favouriteNumber;
    // by default the visibility is internal (this contract and
    //its inheritors

    function store(uint256 _favouriteNumber) public{
        favouriteNumber = _favouriteNumber;
    }

    function pureFunc() public pure returns(uint256){
        uint256 thisser = 23;
        thisser= 234;
        return thisser;
    }

    // pure and view functions don't cost any gas unless they are called
    // inside a regular function because it costs the regular function 
    // some computation

    struct People{
        uint256 favouriteNumber;
        string name;
    }

    People public person  = People({
        favouriteNumber:2,
        name:"Sam" 
    });
    // notice the semicolon after the struct variable!

    People[] public people;
    //(we can put length inside the square brackets)
    
    //pushing structs to an array of structs
    function addPerson(string memory _name, uint256 _favouriteNumber) public{
        People memory newPerson = People({favouriteNumber:_favouriteNumber, name:_name});
        people.push(newPerson);
        nameToFavouriteNumber[_name] = _favouriteNumber;
        
        // we can also directly do: people.push(People(_favouriteNumber, _name));

    }

    //memory and calldata are temporary 
    //calldata can't be modified but memory can

    //these data locations can only be specified for array struct or mapping
    //types

    //mappings
    mapping(string=>uint256) public nameToFavouriteNumber;
    


}
 


