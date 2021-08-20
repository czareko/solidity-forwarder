const Forwarder = artifacts.require('Forwarder');
const ForwarderFactory = artifacts.require('ForwarderFactory');


contract('ForwarderFactory', (accounts)=>{

    beforeEach(async function () {
        forwarder = await Forwarder.new()
        forwarderFactory = await ForwarderFactory.new(forwarder.address);    
    });

    it('should create new address',async()=>{
        const destination = accounts[0];
        await forwarder.initialize(destination);
        const forwarderDestination = await forwarder.destination.call();
        console.log('Original destination: '+forwarderDestination);
        const salt = 34554;
        const clonedForwarder = await forwarderFactory.cloneForwarder.call(forwarder.address,web3.utils.asciiToHex(salt));

        assert.notEqual(forwarder.address,clonedForwarder,'Cloned forwarder should have a different address');

    });
    it('should have the same destination',async()=>{
        const destination = accounts[0];
        await forwarder.initialize(destination);
        //TODO
    });
});