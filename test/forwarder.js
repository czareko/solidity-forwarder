const Forwarder = artifacts.require('Forwarder');

contract('Forwarder', (accounts)=>{

    beforeEach(async function () {
        forwarder = await Forwarder.new()
    });

    it('should be initialized properly',async()=>{
        const destination = accounts[0];
        await forwarder.initialize(destination);
        const destinationFromForwarder = await forwarder.destination.call();

        assert.equal(destinationFromForwarder,destination,'Destination should be the same as initialization');
    });
});