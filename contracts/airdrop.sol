// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';

contract Airdrop {
    address[] claimedAccounts;
    address public Owner;
    IERC20 public token;
    bytes32 private merkleRoot;
    bytes32[] private MerkleProof_;

    mapping(address => bool) public hasClaimed;

    constructor(IERC20 _token, bytes32 _merkleRoot, bytes32[] memory _merkleProof) {
        Owner = msg.sender;
        token = _token;
        merkleRoot = _merkleRoot;
        MerkleProof_ = _merkleProof;
    }

    function claimAirdrop(address _winner, uint256 _amount) public returns(bool success) {
        if (_winner == address(0)) {revert('Invalid account');}
        if(hasClaimed[_winner]) { revert('Account has claimed airdrop');} 
        if(_amount < 0) { revert('Enter valid amount');}

        /// @notice Hash the address with the amount and verify with merkle root
        bytes32 node = keccak256(abi.encodePacked(_winner, _amount));
        require(MerkleProof.verify(MerkleProof_, merkleRoot, node), 'Account not whitelisted');

        /// @notice  If all checks return true, claim airdrop
        success = token.transfer(_winner, _amount);
        require(success, 'Claim failed...!');
        hasClaimed[_winner] = true;
        claimedAccounts.push(_winner);

    }


    ////////////////////  CORE V2  //////////////////////
}
