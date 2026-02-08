import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy ForgeToken
  console.log("\nDeploying ForgeToken...");
  const ForgeToken = await ethers.getContractFactory("ForgeToken");
  const forgeToken = await ForgeToken.deploy();
  await forgeToken.waitForDeployment();
  const forgeTokenAddress = await forgeToken.getAddress();
  console.log("ForgeToken deployed to:", forgeTokenAddress);

  // Deploy TaskEscrow
  console.log("\nDeploying TaskEscrow...");
  const TaskEscrow = await ethers.getContractFactory("TaskEscrow");
  const taskEscrow = await TaskEscrow.deploy();
  await taskEscrow.waitForDeployment();
  const taskEscrowAddress = await taskEscrow.getAddress();
  console.log("TaskEscrow deployed to:", taskEscrowAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("ForgeToken:", forgeTokenAddress);
  console.log("TaskEscrow:", taskEscrowAddress);
  console.log("\nAdd these to your .env.local:");
  console.log(`NEXT_PUBLIC_FORGE_TOKEN_ADDRESS=${forgeTokenAddress}`);
  console.log(`NEXT_PUBLIC_TASK_ESCROW_ADDRESS=${taskEscrowAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
