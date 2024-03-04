const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserManagement", function () {
  it("Should register a user and get his address by his name", async function () {
    const UserManagement = await ethers.getContractFactory("UserManagement");
    const userManagement = await UserManagement.deploy();
    await userManagement.deployed();

    await userManagement.registerUser("Alice");

    const getUserByName = await userManagement.getUserByName("Alice");
    console.log("UserByName", getUserByName)

    const isRegistered = await userManagement.isRegisteredByAddress(getUserByName);
    expect(isRegistered).to.be.true;
  });

  it("Should not allow to register a user with the same name", async function () {
    const UserManagement = await ethers.getContractFactory("UserManagement");
    const userManagement = await UserManagement.deploy();
    await userManagement.deployed();

    await userManagement.registerUser("Alice");

    await expect(userManagement.registerUser("Alice")).to.be.revertedWith("User already registered.");
  });
  
});
