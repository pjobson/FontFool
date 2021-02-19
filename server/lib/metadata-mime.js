const execSync = require('child_process').execSync;

/*
 * Normalizes the File Metadata
 * @param {string} thisFont - the font
 */
exports.get = async (thisFont, mimetype) => {
	// console.log(`MimeType Metadata: ${thisFont}`)
	return new Promise(async resolve => {
		// escape dollar signs
		thisFont = thisFont.replace(/\$/,"\\\$");
		const mimeExec = `${mimetype} "${thisFont}"`;
		const mimeData = await execSync(mimeExec).toString();
		resolve({ mimeType: mimeData.split(':')[1].trim() });
	});
};
