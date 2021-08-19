pragma solidity >=0.5.0 <0.7.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract Forwarder is Ownable{
  address payable public destination;

  constructor(address payable _destination) public {
    destination = _destination;
  }

  function init(address payable _destination) public{
    destination = _destination;
  }

  function flushERC20(address tokenContractAddress) public {
    IERC20 tokenContract = ERC20(tokenContractAddress);
    uint256 forwarderBalance = tokenContract.balanceOf(address(this));
    tokenContract.transfer(destination, forwarderBalance);
  }

  function flushETH() public {
      destination.transfer(address(this).balance);
  }

}