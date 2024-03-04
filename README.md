# SmartBet Platform

## Introduction

SmartBet est une plateforme de paris sportifs décentralisée basée sur la blockchain Ethereum, utilisant Hardhat pour le développement, le test, et le déploiement des contrats intelligents. Cette plateforme permet aux utilisateurs de parier sur les résultats des matchs de football de la première ligue, offrant une approche transparente, sécurisée, et sans intermédiaire pour les paris sportifs.

## Technologies Utilisées

- Solidity : Langage de programmation pour écrire les contrats intelligents.
- Hardhat : Environnement de développement Ethereum pour compiler, déployer, tester, et déboguer les contrats intelligents.
- Ethers.js : Bibliothèque permettant d'interagir avec la blockchain Ethereum.
  Fonctionnalités des Contrats Intelligents
  UserManagement
  Gère l'enregistrement et la vérification des utilisateurs. Permet aux utilisateurs de s'inscrire sur la plateforme en fournissant un nom d'utilisateur.

## Fonction utilisées

#### SmartContract UserManagement

registerUser: Enregistre un nouvel utilisateur.
isRegisteredByAddress: Vérifie si une adresse est déjà enregistrée.

> Gère les informations relatives aux matchs de football, y compris l'ajout de nouveaux matchs et la mise à jour des scores.

#### MatchManagement

addMatch: Ajoute un nouveau match à la plateforme.
updateScore: Met à jour le score d'un match une fois terminé.

> Permet aux utilisateurs enregistrés de placer des paris sur les matchs et gère la distribution des gains.

#### BetManagement

placeBet: Permet à un utilisateur de parier sur le résultat d'un match.
distributeWinnings: Distribue les gains aux utilisateurs ayant correctement prédit les scores des matchs, si il y'a 5 gagants, les gains sont redistribués aléatoirement parmis les 5.

## Comment Tester

Pour tester les contrats intelligents SmartBet, suivez ces étapes :

Installation

- Clonez le dépôt Git sur votre machine locale.
- Installez les dépendances en exécutant npm install dans le répertoire racine du projet.
- Compilation des Contrats

Compilez les contrats intelligents en exécutant :

> npx hardhat compile

Exécution des Tests
Les tests unitaires sont écrits pour vérifier la logique des contrats intelligents. Pour exécuter ces tests :

> npx hardhat test

Les tests couvrent différents scénarios, tels que l'enregistrement des utilisateurs, la gestion des matchs, le placement des paris, et la distribution des gains.

pour deploy :

> npx hardhat run scripts/deploy.js
