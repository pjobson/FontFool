const execSync = require('child_process').execSync;
/*
 * Gets the md5sum of the font file
 * @param {string} thisFont - the font
 */
exports.get = async (thisFont, md5sum) => {
	// console.log(`MD5Sum Metadata: ${thisFont}`);
	return new Promise(async (resolve) => {
		// escape dollar signs
		thisFont = thisFont.replace(/\$/,"\\\$");
		const md5Exec = `${md5sum} "${thisFont}"`;
		const md5Data = await execSync(md5Exec).toString();
		resolve(md5Data.slice(0,32));
	});
}
