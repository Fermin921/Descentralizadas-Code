const {ethers} = require("hardhat");
//Codigo para realizar el deploy de un contrato
async function main() {
    const NFT = await ethers.getContractFactory("NFTClase"); //Detntro de artifcas contracts pones el nombre del json entre comillas
    const nfts = await NFT.deploy();
    const txHash = nfts.deployTransaction.hash;
    const txReceipt = await ethers.provider.waitForTransaction(txHash);
    console.log("Contract deployed to address: ", txReceipt.contractAddress);
}

main().then(() => {process.exit(0);})
.catch((error) =>{
    console.log(error);
    process.exit(1);
});