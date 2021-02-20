const findit = require('findit');

/*
 * Wrapper for findit
 * @param path - path to search
 * @param regex - regex to match
 */
exports.FindFiles = async (path, regex) => {
	const fileList = [];
	return new Promise(async resolve => {
		const F = findit(path);
		F.on('file', (file) => {
			regex.test(file) ? fileList.push(file) : void(0);
		});

		F.on('end', () => {
			resolve(fileList);
		});
	});
};
