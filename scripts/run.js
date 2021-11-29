
const main = async () => {

    const [owner, randomPerson] = await hre.ethers.getSigners();

    // This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory.
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    // Hardhat will create a local Ethereum network for us, but just for this contract.
    const waveContract = await waveContractFactory.deploy();
    // We'll wait until our contract is officially deployed to our local blockchain! Our constructor runs when we actually deploy.
    await waveContract.deployed();
    // Finally, once it's deployed, waveContract.address  will basically give us the address of the deployed contract. 
    console.log("Contract deployed to: ", waveContract.address);
    console.log("Contract deployed by: ", owner.address);
    
    // Wave with the owner
    let waveTxn;

    // Wave with the owner
    console.log("==========================================================");
    waveTxn = await waveContract.wave();
    for (let index = 0; index < 10; index++) {
        waveTxn = await waveContract.wave();
        await waveTxn.wait();
    }
    console.log("==========================================================");

    // Wave with the randomPerson
    console.log("==========================================================");
    for (let index = 0; index < 5; index++) {
        waveTxn = await waveContract.connect(randomPerson).wave();
        await waveTxn.wait();
    }
    console.log("==========================================================");

    const waveCntOwner = await waveContract.getWaves(owner.address);
    const waveCntRandomPerson = await waveContract.getWaves(randomPerson.address);
    console.log("We have %d wave(s) from %s!!!", waveCntOwner, owner.address);
    console.log("We have %d wave(s) from %s!!!", waveCntRandomPerson, randomPerson.address);
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
