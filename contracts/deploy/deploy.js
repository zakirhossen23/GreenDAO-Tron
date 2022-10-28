
// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	const name = 'tCET';
	const symbol = 'tCET';

	await deploy('CoinExERC721', {
		from: deployer,
		args: [name, symbol],
		log: true,
	});
};

func.tags = ['tCET'];
module.exports = func;