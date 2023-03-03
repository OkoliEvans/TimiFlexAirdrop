import { ethers } from "hardhat";
import { keccak256, Bytes } from "ethers/lib/utils";
import { MerkleTree } from "merkletreejs";

import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';



async function main() {
  

  //////////////////////  GET CSV FILE  /////////////////////////
type AirdropInfo = {
  address: string;
  amount: number;
};

  const csvFilePath = path.resolve(__dirname, '../winners.csv');

  const headers = ['address', 'amount'];
  const outputDirPath = path.join(__dirname, 'output');
  const outputFilePath = path.join(outputDirPath, 'result.json');
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  let leaves: string[] = [];

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
  });

  //////////////////////////  MERKLE TREE  ///////////////////////////
  const filePath = path.join(__dirname, './output');
  const resultsPath = path.join(filePath, 'result.json');
  const fileData = fs.readFileSync(resultsPath, 'utf-8');
  const jsonFile = JSON.parse(fileData);
  jsonFile.shift();

  const list : AirdropInfo[] = jsonFile;
  for(let i = 0; i < jsonFile.length; i++) {
    const address = jsonFile[i].address;
    const amount = jsonFile[i].amount;

    let leaf = ethers.utils.solidityKeccak256(["address", "uint256"],[address, amount]);
    leaves.push(leaf);
  }

  const leaveList = path.resolve(filePath,'leaves.json');
  const JSONLeaves = JSON.stringify(leaves);
  fs.writeFileSync(leaveList,JSONLeaves);

  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = tree.getRoot().toString('hex');
  
              /// GET PROOF  ///
  let leaf1 = "0x1f480e4c9d75a29f01ac782acc15a74ca1c3bfc4914f85f0950ca5e506038669";
  const proof = tree.getProof(leaf1);
  const verified = tree.verify(proof, leaf1, root);
  
  //ROOT = e1f3dd2e3ff6fb5c04a9347b0ae112d027f12e7ca2aa78c7eede2b8630032e7c
  
  


}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
