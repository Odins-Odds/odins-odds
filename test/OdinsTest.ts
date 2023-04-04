const { expect } = require('chai');
const { ethers } = require('hardhat');


describe('OdinsOdds', function () {

  it('IDAO is confirmed should return true', async function () {
		const [odinOwner] = await ethers.getSigners();
    const OdinsOdds = await ethers.getContractFactory('OdinsOdds');
    const odinsOdds = await OdinsOdds.connect(odinOwner).deploy();
    await odinsOdds.deployed();
    const isConfirmedResult = await odinsOdds.connect(odinOwner).isConfirmed(true);
    expect(isConfirmedResult).to.equal(true);
	});

});