//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {

    struct WaveInfo {
        string message;
        uint timestamp;
    }

    mapping (address => WaveInfo[]) private waves;
    uint private seed;

    event NewWave(address indexed from, uint timestamp, string message);

    constructor() payable {
        console.log("We've been constructed!");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {

        WaveInfo[] storage wavesBefore = waves[msg.sender];
        require(
            wavesBefore.length == 0 || wavesBefore[wavesBefore.length-1].timestamp + 15 minutes < block.timestamp,
            'Wait 15 minutes!!!'
        );

        waves[msg.sender].push(WaveInfo(_message, block.timestamp));
        console.log("%s has waved at %d: %s", msg.sender, block.timestamp, _message);
        emit NewWave(msg.sender, block.timestamp, _message);

        
        // Generate a new seed for the next user that sends a wave
        seed = (block.timestamp + block.difficulty + seed) % 100;
        console.log("Random # generated : ", seed);
        if ( seed >= 50 ) {
            console.log("%s won", msg.sender);

            // send 0.0001 ETH to the winner
            uint prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has.");
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
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