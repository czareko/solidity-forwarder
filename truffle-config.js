const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const secrets = JSON.parse(fs.readFileSync(".secrets.json").toString().trim());

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      gas: 6721975,
      network_id: "*", // Match any network id
    },
    ropsten: {
      networkCheckTimeout: 10000,
      provider: () => {
        var provider = new HDWalletProvider({
            mnemonic: secrets.MNEMONIC,
            providerOrUrl: `https://ropsten.infura.io/v3/${secrets.PROJECT_ID}`,
            addressIndex: 0,
        });
        return provider;
    },
      network_id: "3",
   },
   kovan: {
    networkCheckTimeout: 10000,
    provider: () => {
      var provider = new HDWalletProvider({
          mnemonic: secrets.MNEMONIC,
          providerOrUrl: `https://kovan.infura.io/v3/${secrets.PROJECT_ID}`,
          addressIndex: 0,
      });
      return provider;
  },
  network_id: "42",
 }
  },
  compilers: {
     solc: {
       version: "0.8.0"    // Fetch exact version from solc-bin (default: truffle's version)
     }
  },
  solc: {
    version: "0.8.0",
    optimizer: {
      enabled: true,
      runs: 200
    },
  }
};
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  //networks: {
  //  development: {
  //    host: "127.0.0.1",
  //    port: 7545,
  //    network_id: "*"
  //  },
  //  test: {
  //    host: "127.0.0.1",
  //    port: 7545,
  //    network_id: "*"
  //  }
  //},
  //
  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
    // enabled: false,
    // host: "127.0.0.1",
    // adapter: {
    //   name: "sqlite",
    //   settings: {
    //     directory: ".db"
    //   }
    // }
  // }
//};
