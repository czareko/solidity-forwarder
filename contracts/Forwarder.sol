// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';

contract Forwarder is Initializable{
  
  address payable public destination;

  function initialize(address payable _destination) public initializer{
    destination = _destination;
  }

  function withdrawERC20(address tokenContractAddress) public {
    IERC20 tokenContract = ERC20(tokenContractAddress);
    uint256 forwarderBalance = tokenContract.balanceOf(address(this));
    tokenContract.transfer(destination, forwarderBalance);
  }

  function withdrawETH() public {
    destination.transfer(address(this).balance);
  }

}