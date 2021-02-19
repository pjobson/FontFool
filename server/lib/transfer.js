const fs = require('fs-extra');

exports.move = async (inFile, outFile) => {
	// console.log(`Moving file to ${outFile}`);
	return new Promise(async (resolve) => {
		fs.moveSync(inFile, outFile, {
			mode: '644',
			overwrite: true
		});
		resolve();
	});
}

exports.copy = async (inFile, outFile) => {
	// console.log(`Copying file to ${outFile}`);
	return new Promise(async (resolve) => {
		fs.copyFileSync(inFile, outFile, {
			mode: '644',
			overwrite: true
		});
		resolve();
	});
}
