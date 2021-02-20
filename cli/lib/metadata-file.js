const execSync = require('child_process').execSync;
/*
 * Normalizes the File Metadata
 * @param {string} thisFont - the font
 */
exports.get = async (thisFont, file) => {
	// console.log(`File Metadata: ${thisFont}`)
	return new Promise(async resolve => {
		// escape dollar signs
		thisFont = thisFont.replace(/\$/,"\\\$");
		const fileExec = `${file} -b "${thisFont}"`;
		const fileData = await execSync(fileExec).toString();
		resolve({ fileInfo: fileData.replace(/\n/g,'') });
	});
};
