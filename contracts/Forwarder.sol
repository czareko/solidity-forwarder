// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';

contract Forwarder is Initializable{
  
  address public destination;

  event ETHReceived(address from, uint value);
  event TokensWithdrawal(address sender, uint256 balance);
  event ETHWithdrawal(address sender, uint256 balance);

  /**
   * This is initialization and it can be executed only once per instance.
   */
  function initialize(address _destination) public initializer{
    destination = _destination;
  }
  
  /**
   * This is standard method. If you send ETH directly to the contract's address,
   * they will be automatically transfered to the destination address.  
   */
  receive() external payable {
    payable(destination).transfer(msg.value);
    emit ETHWithdrawal(msg.sender, msg.value);
  }

  /**
   * This method will transfer coins from the token contract to the destination address.
   */
  function withdrawERC20(address tokenContractAddress) public {
    IERC20 tokenContract = ERC20(tokenContractAddress);
    uint256 forwarderBalance = tokenContract.balanceOf(address(this));
    tokenContract.transfer(destination, forwarderBalance);
    
    emit TokensWithdrawal(address(this),forwarderBalance);
  }

  /**
   * It is possible that funds were sent to this address before the contract was deployed.
   * We can flush those funds to the parent address.
   */
  function withdrawETH() public {
    payable(destination).transfer(address(this).balance);
    emit ETHWithdrawal(address(this),address(this).balance);
  }

}