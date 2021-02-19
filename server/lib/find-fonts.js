const { FindFiles } = require('./find-files');

/*
 * Finds ttf, otf, and woff files
 */
exports.FindFonts = async (pathIn) => {
	return new Promise(async resolve => {
		const fonts = await FindFiles(pathIn, /\.(ttf|otf|woff)$/i);
		resolve(fonts);
	});
}


