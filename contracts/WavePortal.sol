//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {

    mapping (address => uint)   waves;

    constructor() {
        console.log("I'm a contract and i'm smart");
    }

    function wave() public {
        waves[msg.sender] ++;
        console.log("%s has waved!!!", msg.sender);
    }

    function getWaves(address waver) view public returns (uint) {
        console.log("We have %d wave(s) from %s!", waves[waver], waver);
        return waves[waver];
    }

}