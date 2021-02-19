const execSync = require('child_process').execSync;
const process  = require('process');
const which    = require('which');

// List of required programs
const programs = {
	sfnt2woff: {
		exec: (which.sync('sfnt2woff-zopfli', { nothrow: true })  || false),
		minVer: false,
		isCore: false,
		url: 'https://github.com/bramstein/sfnt2woff-zopfli'
	},
	fcscan: {
		exec: (which.sync('fc-scan', { nothrow: true })  || false),
		minVer: false,
		isCore: false,
		url: 'https://www.freedesktop.org/wiki/Software/fontconfig/'
	},
	ttx: {
		exec: (which.sync('ttx', { nothrow: true })      || false),
		minVer: 3.0,
		verSw: '--version',
		verRe: /^(\d+\.\d+)/,
		isCore: false,
		url: 'https://github.com/fonttools/fonttools'
	},
	stat: {
		exec: (which.sync('stat', { nothrow: true })     || false),
		minVer: false,
		isCore: true,
		url: false
	},
	file: {
		exec: (which.sync('file', { nothrow: true })     || false),
		minVer: false,
		isCore: true,
		url: false
	},
	mimetype: {
		exec: (which.sync('mimetype', { nothrow: true }) || false),
		minVer: false,
		isCore: true,
		url: false
	},
	md5sum: {
		exec: (which.sync('md5sum', { nothrow: true })   || false),
		minVer: false,
		isCore: true,
		url: false
	},
	fontforge: {
		exec: (which.sync('fontforge', { nothrow: true })   || false),
		minVer: false,
		isCore: false,
		url: 'https://fontforge.org/'
	}
};

class Programs {
	/*
	 * Standard Constructor is Standard
	 */
	constructor() {
		this.completed = 0;
		this.loop;
		this.init();
	}

	/*
	 * Validates the programs
	 */
	init = async () => {
		await this.validate();
	}

	/*
	 * Determines if all the program checks are complete
	 */
	onComplete = async () => {
		return new Promise(async resolve => {
			this.loop = setInterval(() => {
				if (this.completed === Object.keys(programs).length) {
					clearInterval(this.loop);
					resolve();
				}
			}, 500);
		});
	}

	validate = async () => {
		return new Promise(async resolve => {
			let fail = false;
			const progKeys = Object.keys(programs);
			for (let i=0;i<progKeys.length;i++) {
				const key = progKeys[i];
				const prog = programs[key];

				// -------------------
				// Test Program Exists
				// -------------------
				if (!prog.exec) {
					fail = true;
					const error = `
						Missing ${key}
						${ (prog.url) ?
							` download at: ${prog.url}` :
							` your system may have a serious problem.`
						}`.replace(/[\n\t]/g,'').trim();
					console.error(error);
					break;
				}
				// --------------------
				// Test Minimum Version
				// --------------------
				if (prog.minVer) {
					let version = await execSync(`${prog.exec} ${prog.verSw}`);
							version = parseFloat(version.toString().match(prog.verRe)[1]);
					if (version < prog.minVer) {
						fail = true;
						console.error(`Minimum version of ${key} is ${prog.minVer} you have ${version}, please upgrade: ${prog.url}`);
						break;
					}
				}
				// ----------------------
				// Add Program to Exports
				// ----------------------
				this.completed++;
				this[key] = prog.exec;
			}

			// If an error occured, exit
			if (fail === true) {
				console.error('...exiting.');
				if (this.loop) {
					clearInterval(this.loop);
				}
				process.exit(0);
			}

			resolve();
		});
	}
};

module.exports = Programs;
