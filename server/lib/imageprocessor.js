// // const execSync    = require('child_process').execSync;
// // const mkdirp      = require('mkdirp');
// // const path        = require('path');
// // const Programs    = require('./programs');
// // const EscapeFixer = require('./escapefixer');

// // exports.imageData = {};


// /*
//  * Builds the Character Name Image
//  * @param {object} fontData - generated font data
//  * @param {object} $paths - path data
//  */
// exports.generateNameImage = async (fontData, $paths) => {
// 	console.log('    Generating font name...');
// 	this.imageData = {};
// 	return new Promise(async (resolve, reject) => {
// 		const nameImagePath = `${$paths.temp}/name.png`;
// 		let fontName = fontData.fileName.match(/^(.+) - [0-9a-f]{32}\./)[1];
// 				fontName = fontName.split('').map(chr => EscapeFixer.fix(chr)).join('');
// 				fontName = fontName.replace(/\$/,"\\\$");
// 		fontData.fontPath = fontData.fontPath.replace(/\$/,"\\\$");

// 		const imageExec = `
// 			${Programs.convert}
// 				-bordercolor white
// 				-border 10x10
// 				-gravity west
// 				-fill black
// 				-font "${fontData.fontPath}"
// 				-density 72
// 				-pointsize 100
// 				label:"${fontName}"
// 				-append
// 			${nameImagePath}
// 		`.replace(/\n/g,'');

// 		const imageIdExec = `
// 			${Programs.identify}
// 			${nameImagePath}
// 		`.replace(/\n/g,'');

// 		let size;

// 		try {
// 			await execSync(imageExec);
// 			size = await execSync(imageIdExec).toString().split(' ')[2].split('x');
// 			this.imageData.name       = nameImagePath;
// 			this.imageData.nameWidth  = parseInt(size[0], 10);
// 			this.imageData.nameHeight = parseInt(size[1], 10);
// 		} catch (err) {
// 			reject(err);
// 		}

// 		resolve();
// 	});
// };

// /*
//  * Builds the font sheet
//  * @param {object} fontData - generated font data
//  * @param {object} $paths - path data
//  */

// exports.generateSheet = async (fontData, $paths) => {
// 	console.log('    Generating font sheet...');
// 	return new Promise(async (resolve, reject) => {
// 		const sheetImagePath = `${$paths.temp}/sheet.png`;
// 		const imageExec = `
// 			${Programs.convert}
// 				-bordercolor white
// 				-border 10x10
// 				"${fontData.fontPath}"
// 			${sheetImagePath}
// 		`.replace(/\n/g,'');

// 		const imageIdExec = `
// 			${Programs.identify}
// 			${sheetImagePath}
// 		`.replace(/\n/g,'');

// 		let size;

// 		try {
// 			await execSync(imageExec);
// 			size = await execSync(imageIdExec).toString().split(' ')[2].split('x');
// 			this.imageData.sheet       = sheetImagePath;
// 			this.imageData.sheetWidth  = parseInt(size[0], 10);
// 			this.imageData.sheetHeight = parseInt(size[1], 10);
// 		} catch (err) {
// 			reject(err);
// 		}
// 		resolve();
// 	});
// };

// /*
//  * Stacks the name and sheet
//  * @param {object} fontData - generated font data
//  */
// exports.stackImages = (fontData) => {
// 	return new Promise(async (resolve, reject) => {
// 		const stackedImage = fontData.image.replace(/\$/,'\\\$');
// 		await mkdirp.sync(path.parse(stackedImage).dir, { mode: '0755' });
// 		const imageExec = `
// 			${Programs.convert}
// 				 canvas:white
// 				-size ${this.imageData.sheetWidth}x${(this.imageData.sheetHeight+this.imageData.nameHeight)}
// 				-gravity west

// 				${this.imageData.name}
// 				${this.imageData.sheet}
// 				-append
// 				"${stackedImage}"
// 		`.replace(/\n/g,'');

// 		try {
// 			await execSync(imageExec);
// 		} catch (err) {
// 			reject(err);
// 		}

// 		resolve();
// 	});
// };

// /*
//  * Optimizes the PNG file
//  * @param {object} fontData - generated font data
//  */
// exports.optimizePNG = async fontData => {
// 	console.log('    Optimizing image...');
// 	return new Promise(async (resolve, reject) => {
// 		fontData.image = fontData.image.replace(/\$/,'\\\$');
// 		const optipngExec = `
// 			${Programs.optipng}
// 			-quiet
// 			-clobber
// 			"${fontData.image}"
// 		`.replace(/\n/g,'');

// 		try {
// 			await execSync(optipngExec);
// 		} catch (err) {
// 			reject(err);
// 		}

// 		resolve();
// 	});
// };
