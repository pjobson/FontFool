const execSync = require('child_process').execSync;

/*
 * Normalizes the Stat Metadata
 * @param {string} thisFont - the font
 */
exports.get = async (thisFont, stat) => {
	// console.log(`Stat Metadata: ${thisFont}`)
	return new Promise(async resolve => {
		// escape dollar signs
		thisFont = thisFont.replace(/\$/,"\\\$");
		const statCmd = `${stat} "${thisFont}"`;
		const statData = await execSync(statCmd).toString();
		resolve({
			size: parseInt(statData.match(/Size: (\d+)/)[1],10),
			modified: statData.match(/Modify: (.+)/)[1]
		});
	});
}
