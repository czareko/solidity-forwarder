const Web3 = require('web3');
const fs = require('fs');
const secrets = JSON.parse(fs.readFileSync("../../.secrets.json").toString().trim());
const netconfig = JSON.parse(fs.readFileSync(".netconfig.json").toString().trim());

const provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/"+secrets.PROJECT_ID);
const web3 = new Web3(provider);

/**
 * Initialize forwarder
 * 
 * Our forwarder doesn't have public constructor. 
 * Instead of this, he implements Initializable pattern from OpenZeppelin library.
 * This method can be run only once. Of course, without it we won't have destination address in our root contract,
 * so whole concept won't work because ForwarderFactory automatically initializes cloned contracts.
 * 
 * ! Please make sure that before you run this script, first you will execute 'truffle compile' from the main project catalog.
 */

async function initForwarder() {

    console.log("Init forwarder test");

    //Web3 listener
    web3.eth.net.isListening()
       .then(() => console.log('web3 is connected'))
       .catch(e => console.log('Wow. Something went wrong'));

    //Smart contract ABI configuration.
    var jsonForwarder = "../../build/contracts/Forwarder.json";
    var parsedForwarder= JSON.parse(fs.readFileSync(jsonForwarder));
    var abiForwarder = parsedForwarder.abi;
    
    web3.eth.accounts.wallet.add(netconfig.PRIVATE_KEY);
    
    const forwarder = new web3.eth.Contract(abiForwarder, netconfig.CONTRACT_FORWARDER_ADDRESS);

    const account = web3.eth.accounts.wallet[0].address

    const destination = web3.utils.toChecksumAddress(netconfig.CONTRACT_FORWARDER_DESTINATION)

    forwarder.methods.initialize(destination).send({ from: account, gas: 3000000 });
    
}

initForwarder();