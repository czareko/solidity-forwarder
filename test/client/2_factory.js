const Web3 = require('web3');
const fs = require('fs');
const secrets = JSON.parse(fs.readFileSync("../../.secrets.json").toString().trim());
const netconfig = JSON.parse(fs.readFileSync(".netconfig.json").toString().trim());

const provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/"+secrets.PROJECT_ID);
const web3 = new Web3(provider);

function randomSeed(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * ForwarderFactory Check
 * 
 */

async function checkFactory() {

    console.log("ForwarderFactory Check");

    //Web3 listener
    web3.eth.net.isListening()
       .then(() => console.log('web3 is connected'))
       .catch(e => console.log('Wow. Something went wrong'));

    //Smart contract ABI configuration.
    var jsonFFactory = "../../build/contracts/ForwarderFactory.json";
    var parsedFFactory= JSON.parse(fs.readFileSync(jsonFFactory));
    var abiFFactory = parsedFFactory.abi;

    var jsonForwarder = "../../build/contracts/Forwarder.json";
    var parsedForwarder= JSON.parse(fs.readFileSync(jsonForwarder));
    var abiForwarder = parsedForwarder.abi;
    
    web3.eth.accounts.wallet.add(netconfig.PRIVATE_KEY);
    
    const forwarderFactory = new web3.eth.Contract(abiFFactory, netconfig.CONTRACT_FACTORY_ADDRESS);
    const forwarder = new web3.eth.Contract(abiForwarder, netconfig.CONTRACT_FORWARDER_ADDRESS);

    const account = web3.eth.accounts.wallet[0].address

    const salt = ''+randomSeed(10000,100000);// sample salt
    const saltHex = web3.utils.asciiToHex(salt);
    
    /**
     * Address prediction check
     */

    console.log('### Predicting address ###\n');

    console.log('Forwarder address: '+forwarder._address);
    console.log('Salt: '+salt);

    const predictedAddress = await forwarderFactory.methods.predictAddress(forwarder._address,saltHex).call({ from: account, gas: 3000000 });
    
    console.log('Predicted Address: '+predictedAddress);
   
    console.log("---------------------------------------------------------------------\n");
    
    /**
     * Destination check
     */

    console.log('### Destination check ###\n');
    const forwarderDestination = await forwarder.methods.getDestination().call({from: account, gas: 3000000});
    
    console.log("Forwarder destination: "+forwarderDestination);

    console.log("---------------------------------------------------------------------\n");
    //console.log(Object.keys(forwarder.methods));
    
    /**
     * Clone check
     */

    console.log('### Clone check ###\n');
    
    const clonedForwarder = await forwarderFactory.methods.cloneForwarder(forwarder._address,saltHex).send({ from: account, gas: 3000000 });
    
    console.log('Cloned contract address: '+clonedForwarder.events['FactoryCloned'].address);
    
    const forwarderClone = new web3.eth.Contract(abiForwarder, predictedAddress);
    
    const forwarderCloneDestination = await forwarderClone.methods.getDestination().call({from: account, gas: 3000000});
    
    console.log('Destination from cloned contract: '+forwarderCloneDestination);

    console.log("---------------------------------------------------------------------\n");
}

checkFactory();