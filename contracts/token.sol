// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20 {

    address Owner;
    constructor(address _to, uint256 _amount) ERC20("TimiFlex","TMX") {
        Owner = msg.sender;
        _mint(_to, _amount);
    }

}



