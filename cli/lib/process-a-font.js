const process         = require('process');
const { ShowWarning } = require('./show-warning');
const Woffification   = require('./woffification');
const Transfer        = require('./transfer');
const FCMetaData      = require('./metadata-fc');
const TTXMetaData     = require('./metadata-ttx');
const StatMetaData    = require('./metadata-stat');
const FileMetaData    = require('./metadata-file');
const MimeMetaData    = require('./metadata-mime');
const MD5SumMetadata  = require('./metadata-md5sum');

const sanitizeFilename = require("sanitize-filename");

const illegalCharacters = /[\\<>:"/|?*\n\t\r\+\[\]\(\)&¶\$'`]/g;
const controlCodes      = /([\u0000-\u001f]|[\u007f-\u009f])/g;

/*
 * processes a font file
 * @param dbConnection  - connection to mongo
 * @param paths         - object containing path information
 * @param programs      - object containing program information
 * @param thisFont      - path of the font we're messing with
 * @param isMoveRequest - boolean if the user requested the font to be moved
 * @param debug         - show debug boolean
 */
class ProcessFont {
	/*
	 * Standard Constructor is Standard
	 */
	constructor(dbConnection, paths, programs, thisFont, isMoveRequest, debug) {
		this.resolver      = null;
		this.$DB           = dbConnection;
		this.paths         = paths;
		this.programs      = programs;
		this.font          = thisFont;
		this.isMoveRequest = isMoveRequest;
		this.debug         = debug || false;
	}

	process = async () => {
		return new Promise(async (resolve, reject) => {
			this.resolver = resolve;

			try {
				console.log(`Gathering Metadata for ${this.font}`);

				await this.$DB.connectionEstablished();

				// Get the FC Scan Metadata
				if (this.debug) { console.log(`fcMD`) }
				const fcMD = await FCMetaData.get(this.font, this.programs.fcscan)
					.catch(async err => {
						await ShowWarning(this.$DB, err.toString(), 'FC-Scan Command Failed', this.font, this.doneFont);
						return;
					});

					// Get the md5sum Metadata
					if (this.debug) { console.log(`md5sumMD`) }
					const md5sumMD = await MD5SumMetadata.get(this.font, this.programs.md5sum);
					if (!md5sumMD) {
						await ShowWarning(this.$DB, '', 'MD5Sum Command Failed', this.font, this.doneFont);
						return;
					}

					// Get the TTX metadata
					if (this.debug) { console.log(`TTX`) }
					const [ttxMD, ttxFile] = await TTXMetaData.get(md5sumMD, this.font, this.paths, this.programs.ttx)
							.catch(async err => {
								await ShowWarning(this.$DB, err.toString(), 'TTX Command Failed', this.font, this.doneFont);
								return;
							});

					// Get the Stat Metadata
					if (this.debug) { console.log(`STAT`) }
					const statMD = await StatMetaData.get(this.font, this.programs.stat);
					if (!statMD) {
						await ShowWarning(this.$DB, '', 'Stat Command Failed', this.font, this.doneFont);
						return;
					}

					// Get the File Metadata
					if (this.debug) { console.log(`FILE`) }
					const fileMD = await FileMetaData.get(this.font, this.programs.file);
					if (!statMD) {
						await ShowWarning(this.$DB, '', 'File Command Failed', this.font, this.doneFont);
						return;
					}

					// Get the Mime Metadata
					if (this.debug) { console.log(`MIME`) }
					const mimeMD = await MimeMetaData.get(this.font, this.programs.mimetype);
					if (!mimeMD) {
						await ShowWarning(this.$DB, '', 'Mime Command Failed', this.font, this.doneFont);
						return;
					}

					// other general info
					// set tempname to the FC-Scan fullname
					let originalName;
					try {
						originalName = fcMD.fullname.find(fullname => fullname.lang === 'English').fullname;
					} catch (er) {
						originalName = fcMD.fullname[0].fullname;
					}

					// Sanitized File Name
					if (this.debug) { console.log(`SANITIZE`) }
					let fontName = originalName;
							// removes one or more periods from start of string
							fontName = fontName.replace(/^\.+/g,'');
							// if nothing left, set to postscriptname or unknown
							fontName = fontName || fcMD.postscriptname || 'unknown';
							// replace illegal characters & control codes
							fontName = fontName.replace(illegalCharacters, '');
							fontName = fontName.replace(controlCodes, '');
							// sanitize it
							fontName = sanitizeFilename(fontName);
							// remove extra spaces
							fontName = fontName.replace(/\s+/g,' ')
							// trim it
							fontName = fontName.trim();

					// real file type, sometime fonts are misnamed
					const fileExt = mimeMD.mimeType.split('/').pop();

					// Create the 3 file names
					const filename     = `${fontName} - ${md5sumMD}.${fileExt}`;
					const metadataname = `${fontName} - ${md5sumMD}.ttx`;
					const woffname     = `${fontName} - ${md5sumMD}.woff`;

					// First and Second Letters for directories
					const firstLtr = filename.split('')[0].toUpperCase().replace(/[^A-Z]/,'#');
					const seconLtr = filename.split('')[1].toUpperCase().replace(/[^A-Z]/,'#');

					// build the font data object
					if (this.debug) { console.log(`FONTDATA`) }
					const fontData = Object.assign(
						{
							letters: [ firstLtr, seconLtr ],
							fontName: originalName,
							charset: ttxMD,
							paths: {
								font:     `${this.paths.outFonts}/${firstLtr}/${firstLtr}${seconLtr}/${filename}`,
								metadata: `${this.paths.outMetadata}/${firstLtr}/${firstLtr}${seconLtr}/${metadataname}`,
								woff:     `${this.paths.outWoff}/${firstLtr}/${firstLtr}${seconLtr}/${woffname}`
							},
							md5sum: md5sumMD,
						},
						fcMD,
						statMD,
						fileMD,
						mimeMD
					);

					// Move the TTX file
					if (this.debug) { console.log(`MV TTX`) }
					await Transfer.move(ttxFile, fontData.paths.metadata);

					// Generate .woff File
					if (this.debug) { console.log(`GEN WOFF`) }
					try {
						await Woffification.convert(this.programs.sfnt2woff, this.font, fileExt, fontData.paths.woff);
					} catch (er) {
						// set woff path to false as this file cannot
						// be rendered on the web side
						fontData.paths.woff = false;
					}

					// Move or copy the font file
					if (this.debug) { console.log(`MV CP FONT`) }
					if (this.isMoveRequest) {
						await Transfer.move(this.font, fontData.paths.font);
					} else {
						await Transfer.copy(this.font, fontData.paths.font);
					}

					// add font to the font collection
					if (this.debug) { console.log(`DB FONT`) }
					await this.$DB.addFont(fontData);
			} catch (err) {
				await ShowWarning(this.$DB, err, '', this.font, false);
			} finally {
				this.doneFont();
			}
		});
	}

	doneFont = () => {
		this.resolver();
	};

};


module.exports = ProcessFont;
