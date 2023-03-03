// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './IToken.sol';
import './token.sol';

contract Airdrop {
    address[] claimedAccounts;
    address public Owner;
    IERC20 public token;

    constructor(IERC20 _token) {
        Owner = msg.sender;
        token = _token;
    }

    function claimAirdrop() public {

    }


    ////////////////////  CORE V2  //////////////////////
    function _claim() internal returns(bool success) {

    }

}





// FUNCTION TO ACCEPT VERIFIED ADDRESS FROM SCRIPT