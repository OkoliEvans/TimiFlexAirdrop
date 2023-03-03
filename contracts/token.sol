// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20 {

    address Owner;
    constructor() ERC20("TimiFlex","TMX") {
        Owner = msg.sender;
        _mint(address(this), 1_000_000);
    }

}



