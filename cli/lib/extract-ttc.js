const execSync = require('child_process').execSync; // https://nodejs.org/api/child_process.html
const { FindFiles } = require('./find-files');

/*
 * Finds and extracts TTC and DFONT files
 */
exports.ExtractTTC = async (doExtract, pathIn, fontforge, ffScriptPath) => {
	if (!doExtract) { return }
	return new Promise(async resolve => {
		// Find *.ttc
		const ttcFiles = await FindFiles(pathIn, /\.(ttc|dfont)$/i);
		// loop the files
		for (let i=0;i<ttcFiles.length;i++) {
			const ttcFile = ttcFiles[i];
			console.log(`Attempting to extract: ${ttcFile}`);
			try {
				// attempt to extract them
				const extractExec = `${fontforge} -script "${ffScriptPath}/ttc2ttf.pe" "${ttcFile}" "${pathIn}"`;
				await execSync(extractExec, { stdio: 'ignore' });
			} catch (er) {
				console.error(`Failed to extract: ${ttcFile}`);
			}
		}
		resolve();
	});
};

