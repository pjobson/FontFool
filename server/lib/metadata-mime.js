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
		let mimeData = await execSync(mimeExec).toString();
		    mimeData = mimeData.split(':')[1].trim();
		    // for some reason OTF reports as this
		    mimeData = mimeData.replace(/.+vnd.oasis.opendocument.formula-template/,'font/otf');
		resolve({ mimeType: mimeData });
	});
};
