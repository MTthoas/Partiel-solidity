// Import de ethers depuis Hardhat pour interagir avec Ethereum
const { ethers } = require("hardhat");

async function main() {
    // Compilation des contrats si nécessaire
    await hre.run('compile');

    // Déploiement de UserManagement
    const UserManagement = await ethers.getContractFactory("UserManagement");
    const userManagement = await UserManagement.deploy();
    await userManagement.deployed();
    console.log("UserManagement deployed to:", userManagement.address);

    // Déploiement de MatchManagement
    const MatchManagement = await ethers.getContractFactory("MatchManagement");
    const matchManagement = await MatchManagement.deploy();
    await matchManagement.deployed();
    console.log("MatchManagement deployed to:", matchManagement.address);

    // Déploiement de BetManagement avec l'adresse de UserManagement
    const BetManagement = await ethers.getContractFactory("BetManagement");
    const betManagement = await BetManagement.deploy(userManagement.address);
    await betManagement.deployed();
    console.log("BetManagement deployed to:", betManagement.address);
}

// Nous recommandons cette approche de gestion des erreurs pour les scripts de déploiement
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
