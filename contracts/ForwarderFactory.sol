// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Forwarder.sol";
import '@openzeppelin/contracts/proxy/Clones.sol';

contract ForwarderFactory{

  event FactoryCloned(address factory);

  /**
   * Standard forwarder based on idea from ERC1167
   */

  function cloneForwarder(address forwarder, bytes32 salt) public returns (Forwarder clonedForwarder) {
    address clonedAddress = Clones.cloneDeterministic(forwarder, salt);
    Forwarder parentForwarder = Forwarder(payable(forwarder));
    clonedForwarder = Forwarder(payable(clonedAddress));
    clonedForwarder.initialize(parentForwarder.getDestination());
    emit FactoryCloned(clonedAddress);
  }

  /**
   * Method for predicting the address without deployment
   */

  function predictAddress(address forwarder, bytes32 salt) public view returns (address predicted){
      return Clones.predictDeterministicAddress(forwarder,salt);
  }
}