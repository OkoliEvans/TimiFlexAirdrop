
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "ethers/lib/utils";
import { parse } from "csv-parse";
import { createReadStream } from "fs";
import * as path from "path";
import * as fs from "fs";

async function main() {
    
  // Read the CSV file
  const file = createReadStream(path.join(__dirname, "winners.csv"), "utf8");

  let fileContents = "";

  file.on("data", (chunk) => {
    fileContents += chunk;
  });

  file.on("end", () => {
    // Parse the CSV file
    parse(fileContents, {
      columns: true,
      skip_empty_lines: true,
    }, (err, records: Record[]) => {
      if (err) {
        console.error(err);
        return;
      }

      // Get the leaves for the merkle tree
      const leaves = records.map((record) => {
        const address = record["address"];
        const amount = record["amount"];
        return keccak256(address + amount);
      });

      // Create the merkle tree
      const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

      // Get the merkle proof for each leaf
      const proofs = records.map((record) => {
        const address = record["address"];
        const amount = record["amount"];
        const leaf = keccak256(address + amount);
        const index = leaves.indexOf(leaf);
        return merkleTree.getProof(leaf, index);
      });

      // Save the proofs to a file
      const proofsJson = JSON.stringify(proofs, null, 2);
      fs.writeFileSync(path.join(__dirname, "proofs.json"), proofsJson);

      // get merkle root
      const root = merkleTree.getHexRoot();
      
      console.log("Merkle root:", root);
      // ROOT = 0xc333c8edc6e19be32f2beffc2e45bbc3493341b8dd12ab506fad729f11e53f3b
    });
  });


    ///////////////////////  DEPLOY CONTRACTS   ////////////////////////////////////
    // const [owner, account1] = await ethers.getSigners();
    // const iOwner = owner.address;

    // /////////////////////  DEPLOY TMX TOKEN  ///////////////////////
    // const Token = await ethers.getContractFactory("Token");
    // const token = await Token.deploy(iOwner,1000000);
    // await token.deployed();
    // const TMX = token.address;
    // console.log(`TMX deployed to: ${TMX}`);

    // /////////////////   DEPLOY AIRDROP CONTRACT  /////////////////
    // const AirdropContract = await ethers.getContractFactory("Airdrop");
    // const airdrop = await AirdropContract.deploy(
    //   TMX,
    //   root,
      
    // );
    
    // await airdrop.deployed();
    // const AirdropContractAddr = airdrop.address;
    // console.log(AirdropContractAddr);
    
}         



  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });