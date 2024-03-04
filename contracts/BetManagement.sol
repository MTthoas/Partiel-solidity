// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MatchManagement.sol";
import "./UserManagement.sol";

contract BetManagement is MatchManagement {
    struct Bet {
        uint matchId;
        uint predictedScoreOne;
        uint predictedScoreTwo;
        address bettor;
    }

    Bet[] public bets;
    mapping(uint => uint[]) matchToBets;
    uint public entryFee = 0.01 ether;
    IUserManagement userManagement;

    constructor(address _userManagementAddress) {
        userManagement = IUserManagement(_userManagementAddress);
        admin = msg.sender; 
    }

    function placeBet(uint matchId, uint predictedScoreOne, uint predictedScoreTwo) external payable {
        require(userManagement.isRegisteredByAddress(msg.sender), "User not registered.");
        require(!matches[matchId].isFinished, "Match already finished.");
        require(msg.value == entryFee, "Incorrect entry fee.");
        bets.push(Bet(matchId, predictedScoreOne, predictedScoreTwo, msg.sender));
        matchToBets[matchId].push(bets.length - 1);
    }

    function checkWinner(uint betId) public view returns (bool) {
        Bet storage bet = bets[betId];
        Match storage match_ = matches[bet.matchId];
        require(match_.isFinished, "Match not finished yet.");

        return bet.predictedScoreOne == match_.scoreOne && bet.predictedScoreTwo == match_.scoreTwo;
    }


    function distributeWinnings(uint matchId) external {
        require(matches[matchId].isFinished, "Match not finished.");

        address[] memory winners = new address[](5);
        uint winnerCount = 0;
        uint totalPool = matchToBets[matchId].length * entryFee;
        uint winningsPerWinner = totalPool / 5; // 5 winners

        // Trouver les gagnants
        for (uint i = 0; i < matchToBets[matchId].length && winnerCount < 5; i++) {
            if (checkWinner(matchToBets[matchId][i])) {
                winners[winnerCount] = bets[matchToBets[matchId][i]].bettor;
                winnerCount++;
            }
        }

        // Si il y'a plus de 5 gagnants, on partage le gain entre 5 gagnants aléatoirement
        if (winnerCount > 5) {
            for (uint i = 5; i < winnerCount; i++) {
                uint randomIndex = i + uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % (winnerCount - i);
                winners[randomIndex] = winners[i];
            }
            winnerCount = 5;
        }

        // Distribuer les gains
        for (uint i = 0; i < winnerCount; i++) {
            payable(winners[i]).transfer(winningsPerWinner);
        }
    }

    

}
