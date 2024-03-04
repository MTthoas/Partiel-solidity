// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MatchManagement {
    struct Match {
        uint id;
        string teamOne;
        string teamTwo;
        uint scoreOne;
        uint scoreTwo;
        bool isFinished;
    }
    
    address public admin;

    Match[] public matches;
    constructor(){
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not an admin");
        _;
    }

    function addMatch(string calldata teamOne, string calldata teamTwo) external {
        matches.push(Match(matches.length, teamOne, teamTwo, 0, 0, false));
    }

    function updateScore(uint matchId, uint scoreOne, uint scoreTwo) external onlyAdmin {
        Match storage match_ = matches[matchId];
        match_.scoreOne = scoreOne;
        match_.scoreTwo = scoreTwo;
        match_.isFinished = true;
    }
}
