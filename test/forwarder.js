const Forwarder = artifacts.require('Forwarder');

contract('Forwarder', (accounts)=>{

    beforeEach(async function () {
        forwarder = await Forwarder.new();
    });

    it('should be initialized properly',async()=>{
        
        const destination = accounts[0];
        await forwarder.initialize(destination);
        const destinationFromForwarder = await forwarder.destination.call();

        assert.equal(destinationFromForwarder,destination,'Destination should be the same as initialization');
    });

    it('should withdraw ETH',async()=>{

        //destination address for the forwarder
        const destination = accounts[2];
        //sender address
        const sender = accounts[1];

        //Forwarder initialization
        await forwarder.initialize(destination);

        const destinationFromForwarder = await forwarder.destination.call();

        //Destination checks for the final calculations
        const destinationStartBalanceWei = await web3.eth.getBalance(destination);
        const destinationStartBalance =  await web3.utils.fromWei(destinationStartBalanceWei,'ether');

        //ETH value to transfer
        const ethValue = 1;
        //Transaction
        const transactionReceipt = await web3.eth.sendTransaction({ from: sender, to: forwarder.address, value: web3.utils.toWei(''+ethValue,'ether') });

        //Destination new balance after the transaction
        const destinationEndBalanceWei = await web3.eth.getBalance(destinationFromForwarder);
        const destinationEndBalance = await web3.utils.fromWei(destinationEndBalanceWei,'ether');

        //Difference
        const destinationDiff = destinationEndBalance - destinationStartBalance;

        //Transaction cost
        const gasPrice = await web3.eth.getGasPrice();
        const gasUsed = transactionReceipt.gasUsed;
        const transactionCostWei = gasPrice*gasUsed;
        const transactionCostETH = await web3.utils.fromWei(''+transactionCostWei,'ether');

        console.log('Gas price: '+ await web3.eth.getGasPrice());
        console.log('Gas used: '+ gasUsed);
        console.log('Transaction cost: '+transactionCostETH);

        assert.equal(destinationDiff,ethValue,'Should have the same value');

    });
});