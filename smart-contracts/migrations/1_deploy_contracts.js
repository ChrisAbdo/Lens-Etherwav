var NFT = artifacts.require('NFT');
var Radio = artifacts.require('Radio');

module.exports = async function (deployer) {
  await deployer.deploy(Radio);
  const radio = await Radio.deployed();
  await deployer.deploy(NFT, radio.address);
};
