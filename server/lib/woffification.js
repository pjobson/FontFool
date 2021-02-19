const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const Transfer = require('./transfer');

exports.convert = async (sfnt2woff, inFile, fileExt, outFile) => {
	return new Promise(async (resolve, reject) => {
		if (!/woff/i.test(fileExt)) {
			// console.log(`Generating WOFF: ${outFile}`);
			const woffCmd = `${sfnt2woff} "${inFile}"`;
			try {
				await execSync(woffCmd, {
					stdio: 'ignore',
					stderr: 'ignore'
				});
				await Transfer.move(inFile.replace(/\.\w+$/,'.woff'), outFile);
				resolve();
			} catch(error) {
				reject(error);
			}
		} else {
			// File is a woff, just make a copy of it
			await Transfer.copy(inFile, outFile);
			resolve();
		}
	});
};
