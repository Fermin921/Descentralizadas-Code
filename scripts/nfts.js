require('dotenv').config({path:require('find-config')('.env')})
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const {ethers} = require('ethers');

const contract = require('../artifacts/Contracts/NFTcontract.sol/NFTClase.json');

const {
    PINATA_API_KEY,
    PINATA_SECRET_KEY,
    API_URL,
    PRIVATE_KEY,
    PUBLIC_KEY,
    CONTRACT_ADDRESS,
} = process.env;
//aaaa
async function createImgInfo(imageRoute){

    const authResponse = await axios.get('https://api.pinata.cloud/data/testAuthentication',{
        headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key : PINATA_SECRET_KEY
        }
    })
    console.log(authResponse)
    const stream = fs.createReadStream(imageRoute);
    const data = new FormData()
    data.append("file", stream)
    const fileResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS",data,{
        // headers:{
        //     "Content-type":`multipart/form-data: boundary=${data._boundary}`,
        //     pinata_api_key:PINATA_API_KEY,
        //     pinata_secret_api_key:PINATA_SECRET_KEY
        // }
    })

    const {data:fileData = {}} = fileResponse;
    const Iphash = fileData;
    const fileIPFS = `https://gateway.pinata.cloud/ipfs/${Ipfshash}`
    console.log(fileIPFS)
    return fileIPFS;


}

async function createJsonInfo(metadata) {
    const pinataJSONBody = {
        pinataContent:metadata
    }
    const jsonResponse = await axios.post( "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        pinataJSONbody,
        {
            headers: {
                "Content-Type": "application/json",
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY
            }
        })
    const {data:jsonData = {}} = jsonResponse;
    const Ipfshash = jsonData;
    const tokenURI = `https://gateway.pinata.cloud/ipfs/${Ipfshash}`
    return tokenURI;
}

async function minNFT(tokenURI){
    const provider = new ethers.providers.JsonRpcProvider(API_URL)
    const wallet = new etthers.Wallet(PRIVATE_KEY,provider);
    const etherInterface = new ethers.utils.Interface(contract.abi)
    const  nonce = await provider.getTransactionCount(PUBLIC_KEY,'latest');
    const gasprice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const {chainId} = network;

    const transaction = {
        from : PUBLIC_KEY,
        to: CONTRACT_ADDRESS,
        nonce,
        chainId,
        gasprice,
        data:etherInterface.encodeFunctionData("mintNFT",[PUBLIC_KEY,tokenURI])
    }

    const estimatedGas = await provider.estiamteGas(transaction);
    transaction["gasLimit"] = estimatedGas
    const singedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(singedtTx);
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;

    const receipt = await provider.getTransactionReceipt(hash);
    const {logs} = receipt;
    const tokenInBigNumber = ethers.BigNumber.from(logs[0].topics[3])
    const tokenId = tokenIdBigNumber.toNumber();
    console.log("NFT Token ID",tokenId);
    return hash
}

async function createNFT(info){
    var imgInfo = await createImgInfo(info.imageRoute); //Agregar la direccion de la imagen para crearla como nft
    const metadata = {
        image:imgInfo,
        name:imgInfo.name,
        description:info.description,
        attributes:[
            {'trait_type':'color','value':'brown'},
            {"trait_type":'background','value':'white'}
        ]
    }
    var tokenUri = await createJsonInfo(metadata)
    var nftResult = await mintNFT(tokenUri)
    return nftResult
}

module.exports = {
    createNFT: createNFT
}