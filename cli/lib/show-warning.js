/*
 * shows a warning, logs it to the db
 * @param dbConnection- connection to mongo
 * @param errorMsg    - the output error message
 * @param textMsg     - human readable error
 * @param font        - name of font
 * @param callback    - what shall I do?
 */
exports.ShowWarning = async (dbConnection, errorMsg, textMsg, font, callback) => {
	return new Promise(async (resolve) => {
		console.warn(textMsg);
		await dbConnection.recordError({
			errorMessage: errorMsg,
			textMessage:  textMsg,
			font:         font,
			timestamp:    Date.now()
		});
		if (callback) {
			callback();
		}
		resolve();
	});
};
