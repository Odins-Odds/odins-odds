const { expect } = require('chai');
const { ethers } = require('hardhat');


describe('OdinsOdds', function () {

  it('IDAO is confirmed should return true', async function () {
		[factoryOwner, escrowOwner] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('');
    factory = await Factory.connect(factoryOwner).deploy();
    await factory.deployed();
    await factory.connect(escrowOwner).createContract();
    const allEscrowContracts = await factory.getAllContracts();
    expect(allEscrowContracts.length).to.equal(1);
	});

});