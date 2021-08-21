// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Forwarder.sol";
import '@openzeppelin/contracts/proxy/Clones.sol';

contract ForwarderFactory{

  event FactoryCloned(address factory);

  function cloneForwarder(address forwarder, bytes32 salt)
      public returns (Forwarder clonedForwarder) {
    address clonedAddress = Clones.cloneDeterministic(forwarder, salt);
    Forwarder parentForwarder = Forwarder(forwarder);
    clonedForwarder = Forwarder(clonedAddress);
    clonedForwarder.initialize(parentForwarder.destination());
    emit FactoryCloned(clonedAddress);
  }
}