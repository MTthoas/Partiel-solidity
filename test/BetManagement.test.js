const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SmartBet Integration Tests", function () {
    let userManagement, betManagement;
    let owner, user1, user2, user3, user4, user5, user6;
    let matchId = 0; // Supposons qu'il s'agit de l'ID du premier match ajouté
    let matchId2 = 1; // Supposons qu'il s'agit de l'ID du deuxième match ajouté
    const entryFee = ethers.utils.parseEther("0.01"); // Le montant d'entrée correspondant à votre contrat

    beforeEach(async function () {
        [owner, user1, user2, user3, user4, user5, user6] = await ethers.getSigners();
        // Déployer UserManagement
        const UserManagement = await ethers.getContractFactory("UserManagement");
        userManagement = await UserManagement.deploy();
        await userManagement.deployed();

        // Déployer BetManagement avec l'adresse de UserManagement
        const BetManagement = await ethers.getContractFactory("BetManagement");
        betManagement = await BetManagement.deploy(userManagement.address);
        await betManagement.deployed();
    });

      it("Should not allow an unregistered user to place a bet", async function () {
        await expect(betManagement.connect(user1).placeBet(matchId, 1, 2, { value: entryFee })).to.be.revertedWith("User not registered.");
    });

    it("Should allow a registered user to place a bet with entry fee", async function () {
        await userManagement.connect(user1).registerUser("User1");
        await betManagement.connect(owner).addMatch("Team A", "Team B");
        await betManagement.connect(user1).placeBet(matchId, 1, 2, { value: entryFee });
    });

    it("Should prevent bets on finished matches", async function () {
        await userManagement.connect(user1).registerUser("User1");
        await betManagement.connect(owner).addMatch("Team A", "Team B");
        await betManagement.connect(owner).updateScore(matchId, 1, 2); // Finir le match

        await expect(betManagement.connect(user1).placeBet(matchId, 1, 2, { value: entryFee }))
            .to.be.revertedWith("Match already finished.");
    });


    it("Should distribute winnings if bet is correct", async function () {
        await userManagement.connect(user1).registerUser("User1");
        await betManagement.connect(owner).addMatch("Team A", "Team B");
        await betManagement.connect(user1).placeBet(matchId, 1, 2, { value: entryFee });
        await betManagement.connect(owner).updateScore(matchId, 1, 2);

        const initialBalance = await ethers.provider.getBalance(user1.address);
        await betManagement.connect(owner).distributeWinnings(matchId);
        const finalBalance = await ethers.provider.getBalance(user1.address);
        expect(finalBalance).to.be.above(initialBalance);
    });

    it("Should allow a registered user to place a bet with entry fee and distribute winnings", async function () {
        await userManagement.connect(user1).registerUser("User1");
        await userManagement.connect(user2).registerUser("User2");

        await betManagement.connect(owner).addMatch("Team A", "Team B");
        await betManagement.connect(user1).placeBet(matchId, 1, 2, { value: entryFee });
        await betManagement.connect(user2).placeBet(matchId, 1, 2, { value: entryFee });
        await betManagement.connect(owner).updateScore(matchId, 1, 2);

        const initialBalanceUser1 = await ethers.provider.getBalance(user1.address);
        const initialBalanceUser2 = await ethers.provider.getBalance(user2.address);

        console.log( "initialBalanceUser1", initialBalanceUser1)
        console.log( "initialBalanceUser2", initialBalanceUser2)

        // Distribution des gains
        await betManagement.connect(owner).distributeWinnings(matchId);

        const finalBalanceUser1 = await ethers.provider.getBalance(user1.address);
        const finalBalanceUser2 = await ethers.provider.getBalance(user2.address);

        console.log( "finalBalanceUser1", finalBalanceUser1)
        console.log( "finalBalanceUser2", finalBalanceUser2)

        expect(finalBalanceUser1).to.be.above(initialBalanceUser1);
    });

     it("distributes winnings correctly among 5 winners", async function () {

        const users = [user1, user2, user3, user4, user5];
        const totalPool = entryFee.mul(5);
        
        for (let i = 0; i < 5; i++) {
            await userManagement.connect(users[i]).registerUser("User" + i);
            await betManagement.connect(owner).addMatch("Team A", "Team B");
            await betManagement.connect(users[i]).placeBet(matchId, 1, 2, { value: entryFee });
        }

        await betManagement.connect(owner).addMatch("Team A", "Team B");
        await betManagement.connect(owner).updateScore(matchId, 1, 2);

        await betManagement.connect(owner).distributeWinnings(matchId);

        const winningsPerWinner = totalPool.div(5);
        for (let i = 0; i < 5; i++) {
            const finalBalance = await ethers.provider.getBalance(users[i].address);
            expect(finalBalance).to.be.above(winningsPerWinner);
        }

    });
});
