const Forwarder = artifacts.require('Forwarder');
const ForwarderFactory = artifacts.require('ForwarderFactory');


contract('ForwarderFactory', (accounts)=>{

    beforeEach(async function () {
        forwarder = await Forwarder.new()
        forwarderFactory = await ForwarderFactory.new(forwarder.address);    
    });

    it('should create new address',async()=>{
        const destination = accounts[0];
        console.log(accounts[0]);
        console.log(accounts[1]);
        console.log(accounts[2]);
        console.log(accounts[3]);
        await forwarder.initialize(destination);
        const forwarderDestination = await forwarder.getDestination.call();
        const salt = 34554; //sample salt
        const clonedForwarder = await forwarderFactory.cloneForwarder.call(forwarder.address,web3.utils.asciiToHex(salt));

        assert.notEqual(forwarder.address,clonedForwarder,'Cloned forwarder should have a different address');

    });
    it('should have the same destination but different contract address',async()=>{
        const destination = accounts[0];
        const transactionSender = accounts[1];
        await forwarder.initialize(destination);
        const forwarderDestination = await forwarder.getDestination.call();
        const salt = 34554;// sample salt
        const transactionReceipt = await forwarderFactory.cloneForwarder(
            forwarder.address,
            web3.utils.asciiToHex(salt),
            {from: transactionSender}
        );

        clonedContractAddress = transactionReceipt.logs[0].args.factory;
        const clonedForwarder = await Forwarder.at(clonedContractAddress);
        const clonedForwarderDestination = await clonedForwarder.getDestination.call();
 
        assert.notEqual(forwarder.address,clonedForwarder.address,'Cloned forwarder should have a different address');
        assert.equal(forwarderDestination,clonedForwarderDestination,'Destination should be cloned from original forwarder');
    });

    it('address should be predictable without deployment', async()=>{
        const destination = accounts[0];
        const transactionSender = accounts[1];
        await forwarder.initialize(destination);
        const forwarderDestination = await forwarder.getDestination.call();
        const salt = 34554;// sample salt

        const predictedAddress = await forwarderFactory.predictAddress.call(forwarder.address,web3.utils.asciiToHex(salt));

        const transactionReceipt = await forwarderFactory.cloneForwarder(
            forwarder.address,
            web3.utils.asciiToHex(salt),
            {from: transactionSender}
        );
        clonedContractAddress = transactionReceipt.logs[0].args.factory;
 
        assert.equal(predictedAddress,clonedContractAddress,'Predicted address should be identical to the one after the deployment');
    });
});