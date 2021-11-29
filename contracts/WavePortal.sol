//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {

    mapping (address => string[])   waves;

    constructor() {
        console.log("I'm a contract and i'm smart");
    }

    function wave(string memory _message) public {
        waves[msg.sender].push(_message);
        console.log("%s has waved:", msg.sender, _message);
    }

    function getWaves(address waver) view public returns (string[] memory) {
        console.log("We have %d wave(s) from %s!", waves[waver].length, waver);
        return waves[waver];
    }

}