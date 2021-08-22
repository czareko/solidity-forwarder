# Automatic Forwarder for ETH and ERC20 with ERC1167

## Introduction
The general concept isn't new and on the Internet, it is possible to find many examples of non-custodial smart contracts. Problem is that they are usually in an old version of Solidity and they were made before [ERC1167](https://eips.ethereum.org/EIPS/eip-1167).

Our idea is based on the [CoinBase blog post](https://blog.coinbase.com/usdc-payment-processing-in-coinbase-commerce-b1af1c82fb0), but with a few fundamental changes.

First of all, the core of this idea is based on market standards. We took contracts and libraries from OpenZeppelin to ensure that we are not duplicating anything that we don’t have to.

The second thing is that the Forwarder smart contract in the blog post is prepared only for tokens, and initialization is based on a constructor that isn’t currently recommended.

The last thing is that our all concept is developed in Solidity 0.8.0, which implies the next positive changes.

To have better understanding of the conncept, please read
- [Smart contract files](https://github.com/czareko/solidity-forwarder/tree/main/contracts)
- [Test files](https://github.com/czareko/solidity-forwarder/tree/main/test)

## Tech stack

[**NPM**](https://www.npmjs.com/) - dependency management

[**Truffle**](https://www.trufflesuite.com/) - project structure and cli management

[**OpenZeppelin**](https://openzeppelin.com/) - verified market standards

[Ganache](https://www.trufflesuite.com/ganache) - for local tests

## Envronment

There are a few technical requirements before you start. 
Please install the following:

1. [Node+NPM](https://nodejs.org/en/)
2. Install trufflesuite, run in console `npm install -g truffle`
3. Install [Ganache](https://www.trufflesuite.com/ganache)

When you will have all tools installed, please remember about running `npm install` in the project root catalog.

Detailed dependent libraries you will find in [package.json](https://github.com/czareko/solidity-forwarder/blob/main/package.json)

If you don't have any IDE, [VSCode](https://code.visualstudio.com/) is simple, free, and good enough to project like this.

Truffle configuration file is prepared for local run - [truffle-config.js](https://github.com/czareko/solidity-forwarder/blob/main/truffle-config.js)

## Commands 

The full command reference is available [here](https://www.trufflesuite.com/docs/truffle/reference/truffle-commands)
