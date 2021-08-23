const Forwarder = artifacts.require('Forwarder');
const ForwarderFactory = artifacts.require('ForwarderFactory');

contract('Forwarder', (accounts)=>{

    beforeEach(async function () {
        forwarder = await Forwarder.new();
        forwarderFactory = await ForwarderFactory.new(forwarder.address);  
    });

    it('should be initialized properly',async()=>{
        
        const destination = accounts[0];
        await forwarder.initialize(destination);
        const destinationFromForwarder = await forwarder.destination.call();

        assert.equal(destinationFromForwarder,destination,'Destination should be the same as initialization');
    });
    
    it('should withdraw ETH for deployed address',async()=>{

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
    

    it('should withdraw ETH received before deployment',async()=>{

        //destination address for the forwarder
        const destination = accounts[2];
        //sender address
        const sender = accounts[1];

        //Forwarder initialization
        await forwarder.initialize(destination);

        let destinationFromForwarder = await forwarder.destination.call();

        //Destination checks for the final calculations
        const destinationStartBWei = await web3.eth.getBalance(destination);
        const destinationStartB =  await web3.utils.fromWei(destinationStartBWei,'ether');

        const salt = 34566;// sample salt

        const predictedAddress = await forwarderFactory.predictAddress(forwarder.address,web3.utils.asciiToHex(salt));

        //ETH value to transfer
        const ethValue = 1;
        //Transaction to predicted address
        await web3.eth.sendTransaction({ from: sender, to: predictedAddress, value: web3.utils.toWei(''+ethValue,'ether') });

        //Destination new balance after the transaction
        const destinationEndBWei = await web3.eth.getBalance(destinationFromForwarder);
        const destinationEndB = await web3.utils.fromWei(destinationEndBWei,'ether');

        //Predicted address balance
        const predictedAddressBWei = await web3.eth.getBalance(predictedAddress);
        const predictedAddressB = await web3.utils.fromWei(predictedAddressBWei,'ether');

        //Difference
        let destinationDiff = destinationEndB - destinationStartB;

        assert.equal(destinationStartB,destinationEndB,'Destination diff after transaction (should be 0)')

        //Clone with the same salt
        const transactionReceiptFromClone = await forwarderFactory.cloneForwarder(
            forwarder.address,
            web3.utils.asciiToHex(salt),
            {from: sender}
        );

        clonedContractAddress = transactionReceiptFromClone.logs[0].args.factory;
        const clonedForwarder = await Forwarder.at(clonedContractAddress);
        const clonedForwarderDestination = await clonedForwarder.destination.call();

        //Here we have sender as an executor, so all fees are on his side
        //We can change this to {from: destination} but of course fees will be on destination side,
        //so final difference won't be exactly ethValue - fees
        //I don't know the use case, but generally it's even possible to limit executors if we need it 
        const txHash = await clonedForwarder.withdrawETH({from: sender});

        //Predicted address balance - again
        const predictedAddressEndBWei = await web3.eth.getBalance(predictedAddress);
        const predictedAddressEndB = await web3.utils.fromWei(predictedAddressEndBWei,'ether');
        assert.equal(predictedAddressEndB,0,'Should be empty again.');

        //Let's check destination from first forwarder
        
        //Destination new balance after withdraw
        destinationFromForwarder = await forwarder.destination.call();
        const destinationAfterWithdrawWei = await web3.eth.getBalance(destinationFromForwarder);
        const destinationEndAfterWithdrawB = await web3.utils.fromWei(destinationAfterWithdrawWei,'ether');

        destinationDiff = destinationEndAfterWithdrawB - destinationStartB;

        assert.equal(destinationDiff,ethValue,'Should have the same value');

    });

});