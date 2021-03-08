const execSync = require('child_process').execSync; // https://nodejs.org/api/child_process.html
const { FindFiles } = require('./find-files');

/*
 * Converts FON and PFB files
 */
exports.ConvertFonts = async (doConvert, pathIn, fontforge, DB, ffScriptPath) => {
	if (!doConvert) { return }

	// Find *.fon / *.pfb
	const convFiles = await FindFiles(pathIn, /\.(fon|pfb)$/i);

	return new Promise(async resolve => {
		// loop the files
		for (let i=0;i<convFiles.length;i++) {
			const convFile = convFiles[i];
			console.log(`Attempting to convert: ${convFile}`);
			try {
				const convertExec = `${fontforge} -script "${ffScriptPath}/convert.pe" "${convFile}"`;
				await execSync(convertExec, { stdio: 'ignore' });
			} catch(er) {
				DB.recordError({
					errorMessage: '',
					textMessage: 'Failed to convert font.',
					font: convFile,
					timestamp: Date.now()
				})
				// console.error(`Failed to convert: ${convFile}`);
			}
		}
		resolve();
	});
};
