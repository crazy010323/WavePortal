
const logMsgs = (messages, timestamps) => {
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const timestamp = timestamps[i] * 1000;
        console.log(' - "', message, '" at ', new Date(timestamp).toISOString());
    }
};

const main = async () => {

    const [owner, randomPerson] = await hre.ethers.getSigners();

    // This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory.
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    // Hardhat will create a local Ethereum network for us, but just for this contract.
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1')
    });
    // We'll wait until our contract is officially deployed to our local blockchain! Our constructor runs when we actually deploy.
    await waveContract.deployed();
    // Finally, once it's deployed, waveContract.address  will basically give us the address of the deployed contract. 
    console.log("Contract deployed to: ", waveContract.address);
    console.log("Contract deployed by: ", owner.address);
    
    /**
     * Get Contract balance
     */
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log('Contract balance (initial): ', hre.ethers.utils.formatEther(contractBalance));

    /**
     * Send wave with both people
     */

    let waveTxn;

    // Wave with the owner twice
    waveTxn = await waveContract.wave("I'm the owner - 1!!!");
    await waveTxn.wait();
    console.log('Contract balance (after owner 1): ', hre.ethers.utils.formatEther(contractBalance));
    waveTxn = await waveContract.wave("I'm the owner - 2!!!");
    await waveTxn.wait();
    console.log('Contract balance (after owner 2): ', hre.ethers.utils.formatEther(contractBalance));
    
    // Wave with the randomPerson
    waveTxn = await waveContract.connect(randomPerson).wave("I'm the randomPerson!!!");
    await waveTxn.wait();
    console.log('Contract balance (before random person): ', hre.ethers.utils.formatEther(contractBalance));
    
    // check feedback
    const resultsForOwner = await waveContract.getWaves(owner.address);
    const {0: messagesForOwner, 1: timestampsForOwner} = resultsForOwner;
    const resultsForRandomPerson = await waveContract.getWaves(randomPerson.address);
    const {0: messagesForRandomPerson, 1: timestampsForRandomPerson} = resultsForRandomPerson;
    
    console.log("=========================================================");
    console.log("===== Message Logs From ", owner.address);
    console.log("=========================================================");
    logMsgs(messagesForOwner, timestampsForOwner);
    console.log("=========================================================");

    console.log("=========================================================");
    console.log("===== Message Logs From ", randomPerson.address);
    console.log("=========================================================");
    logMsgs(messagesForRandomPerson, timestampsForRandomPerson);
    console.log("=========================================================");
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();
