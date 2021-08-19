const Forwarder = artifacts.require("Forwarder");
const ForwarderFactory = artifacts.require("ForwarderFactory");

module.exports = async function(deployer) {

  const accounts = await web3.eth.getAccounts();
	const owner = accounts[0];

  deployer.deploy(Forwarder,owner);
  deployer.link(Forwarder,ForwarderFactory);
  deployer.deploy(ForwarderFactory);

};
