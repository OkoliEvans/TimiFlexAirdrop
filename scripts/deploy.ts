import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';
import MerkleTree from "merkletreejs";

async function main() {
  

  //////////////////////  GET CSV FILE  /////////////////////////
type AirdropInfo = {
  address: string;
  amount: number;
};

(() => {
  const csvFilePath = path.resolve(__dirname, '../winners.csv');

  const headers = ['address', 'amount'];
  const outputDirPath = path.join(__dirname, 'output');
  const outputFilePath = path.join(outputDirPath, 'result.json');
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  parse(fileContent, {
    delimiter: ',',
    columns: headers,
  }, (error, result: AirdropInfo[]) => {
    if (error) {
      console.error(error);
    }

     // Create output directory
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath);
  }

      /// save the json data
    const outputData = JSON.stringify(result, null, 2);
    fs.writeFileSync(outputFilePath, outputData);
    console.log("Result", result);
  });
  
})();

//////////////////////////  MERKLE TREE  ///////////////////////////

const keccak256 = require("keccak256")

let list = 
let leaves = list.map(addr => keccak256(addr))
let merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true})
let rootHash = merkleTree.getRoot().toString('hex')

//////////////// confirm data in root  //////////////////
let address = "0x..." // The input
let hashedAddress = keccak256(address)
let proof = merkleTree.getHexProof(hashedAddress);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
