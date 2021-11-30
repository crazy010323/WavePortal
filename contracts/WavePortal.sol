//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {

    struct WaveInfo {
        string message;
        uint timestamp;
    }

    mapping (address => WaveInfo[]) waves;

    event NewWave(address indexed from, uint timestamp, string message);

    constructor() {
        console.log("I'm a contract and i'm smart");
    }

    function wave(string memory _message) public {
        waves[msg.sender].push(WaveInfo(_message, block.timestamp));
        console.log("%s has waved at %d: %s", msg.sender, block.timestamp, _message);
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getWaves(address _waver) public view returns(string[] memory, uint[] memory) {
        WaveInfo[] storage wavesForWaver = waves[_waver];
        uint length = wavesForWaver.length;
        string[] memory messages = new string[](length);
        uint[] memory timestamps = new uint[](length);
        for ( uint i = 0; i < length; i++ ) {
            messages[i] = wavesForWaver[i].message;
            timestamps[i] = wavesForWaver[i].timestamp;
        }
        return (messages, timestamps);
    }

}