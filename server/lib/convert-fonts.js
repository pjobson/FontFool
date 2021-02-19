const execSync = require('child_process').execSync; // https://nodejs.org/api/child_process.html
const { FindFiles } = require('./find-files');

/*
 * Converts FON and PFB files
 */
exports.ConvertFonts = async (doConvert, pathIn, fontforge, ffScriptPath) => {
	if (!doConvert) { return }
	return new Promise(async resolve => {
		// Find *.fon / *.pfb
		const convFiles = await FindFiles(pathIn, /\.(fon|pfb)$/i);
		// loop the files
		for (let i=0;i<convFiles.length;i++) {
			const convFile = convFiles[i];
			console.log(`Attempting to convert: ${convFile}`);
			try {
				const convertExec = `${fontforge} -script "${ffScriptPath}/convert.pe" "${convFile}"`;
				await execSync(convertExec, { stdio: 'ignore' });
			} catch(er) {
				console.error(`Failed to convert: ${convFile}`);
			}
		}
		resolve();
	});
};
