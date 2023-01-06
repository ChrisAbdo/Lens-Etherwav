const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync('.secret').toString().trim();
const projectId = 'ffbdc57dd4f342a295c09602c39f8801';
module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },

    matic: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://polygon-mumbai.infura.io/v3/${projectId}`
        ),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },

    rinkby: {
      provider: () =>
        new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/`),
      network_id: 4,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },

    optimism: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://optimism-goerli.infura.io/v3/${projectId}`
        ),
      network_id: 420,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.17',
    },
  },
};
