// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUserManagement {
    function registerUser(string calldata name) external;
    function getUserByName(string calldata name) external view returns (address);
    function isRegisteredByAddress(address userAddress) external view returns (bool);
    function isRegistered() external view returns (bool);
}

contract UserManagement {
    
    struct User {
        string name;
        address userAddress;
    }

    mapping(address => bool) public registeredUsers;

    User[] public users;

    function registerUser(string calldata name) external {
        require(!registeredUsers[msg.sender], "User already registered.");
        users.push(User(name, msg.sender));
        registeredUsers[msg.sender] = true;
    }

    // get User by name and returns his address
    function getUserByName(string calldata name) public view returns (address userAddress) {
        for (uint i = 0; i < users.length; i++) {
            if (keccak256(abi.encodePacked(users[i].name)) == keccak256(abi.encodePacked(name))) {
                return users[i].userAddress;
            }
        }
    }

    // verify if user is registered by his address
    function isRegisteredByAddress(address userAddress) public view returns (bool) {
        return registeredUsers[userAddress];
    }

    function isRegistered() public view returns (bool) {
        return registeredUsers[msg.sender];
    }

}