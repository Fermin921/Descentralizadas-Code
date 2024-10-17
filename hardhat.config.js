/** @type import('hardhat/config').HardhatUserConfig */

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

// const {API_URL, PRIVATE_KEY} = process.env;
const API_URL= 'https://eth-sepolia.g.alchemy.com/v2/_bSHE45NaWcmavrbNjVHprqBHMZpBF3z';
const PRIVATE_KEY= '95e41d9ce2a6a6deb17cbd23932ecd0aec2c0729be483ac200df4608459878f8'

//Esta configuracion configura el nodo que se va utilizar, se ocupara sepolia y ocupara la llave privada para las transacciones 
module.exports = {
  solidity: "0.8.24",
  defaultNetwork:"sepolia",
  networks:{
    sepolia :{
      url : API_URL,
      accounts : [`0x${PRIVATE_KEY}`]
    }
  }
};

//0x35F43E5338Ab4b26e629Ce39eDFd8F7540E4e421