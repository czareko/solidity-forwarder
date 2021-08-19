const Forwarder = artifacts.require("Forwarder");
const ForwarderFactory = artifacts.require("ForwarderFactory");

module.exports = async function(deployer) {

  deployer.deploy(Forwarder);
  deployer.link(Forwarder,ForwarderFactory);
  deployer.deploy(ForwarderFactory);

};
