/*
 * ╔═╝╔═║╔═ ═╔╝  ╔═╝╔═║╔═║║
 * ╔═╝║ ║║ ║ ║ ═╝╔═╝║ ║║ ║║
 * ╝  ══╝╝ ╝ ╝   ╝  ══╝══╝══╝
 *
 * Do you have no idea what ARBLD12_.ttf
 * is? Yeah neither do I, that crap
 * was left over from the DOS days.
 */

/*
 * CORE NODE MODULES
 */
const process = require('process'); // https://nodejs.org/api/process.html
const path    = require('path');    // https://nodejs.org/api/path.html
const os      = require('os');      // https://nodejs.org/api/os.html

/*
 * EXTERNAL MODULES
 */
const minimist = require('minimist'); // https://www.npmjs.com/package/minimist
const fs       = require('fs-extra'); // https://github.com/jprichardson/node-fs-extra
const mkdirp   = require('mkdirp');   // https://www.npmjs.com/package/mkdirp
const rimraf   = require('rimraf');   // https://www.npmjs.com/package/rimraf
const Agenda   = require('agenda');   // https://github.com/agenda/agenda#multiple-job-processors


/*
 * INTERNAL MODULES
 */
const Programs         = require('./lib/programs');
const Database         = require('./lib/database');
const ProcessFont      = require('./lib/process-a-font');
const { RTFM }         = require('./lib/RTFM');
const { ExtractTTC }   = require('./lib/extract-ttc');
const { ConvertFonts } = require('./lib/convert-fonts');
const { FindFonts }    = require('./lib/find-fonts');

/*
 * GLOBALS
 */
let $programs;
let $queue              = 20;
let $moveFiles          = false;
let $getHelp            = false;
let $extractTTC         = false;
let $convertFont        = false;
let $fontList           = [];
const $paths            = {};
const $temp             = `${os.tmpdir()}/fontfool`;
const FontForgeScripts  = `${__dirname}/fontforge_scripts`;
const $DB               = new Database();


/* --------------------------------------------------- */

/**
 * Initializes the fool
 * @function
 */
const foolInit = async () => {
	// setup globals
	const argv = minimist(process.argv.slice(2))
	$paths.in    = argv.in        || false;
	$paths.out   = argv.out       || false;
	$queue       = argv.queue     || $queue;
	$moveFiles   = argv.move      || false;
	$getHelp     = argv.help      || false;
	$extractTTC  = argv.ttcext    || false;
	$convertFont = argv.converter || false;

	// RTFM?
	RTFM(($getHelp || !$paths.in || !$paths.out) || false);

	// Setup Paths
	await setupPaths();

	// instantiate programs and wait for them to initialize
	$programs = new Programs();
	await $programs.onComplete();

	// Wait for these to complete
	await Promise.all([
		// Extract TTC Files
		ExtractTTC($extractTTC, $paths.in, $programs.fontforge, FontForgeScripts),
		// Convert Files
		ConvertFonts($convertFont, $paths.in, $programs.fontforge, $DB, FontForgeScripts)
	]);

	// finds all font files
	$fontList = await FindFonts($paths.in);

	// If queue size is greater than the fonts, set it to the font list length
	$queue = ($queue > $fontList.length) ? $fontList.length : $queue;

	await processFonts();

	$DB.close();

	await clearTemp();

	console.log(`
	╔═╝╔═║╔═ ═╔╝  ╔═╝╔═║╔═║║
	╔═╝║ ║║ ║ ║ ═╝╔═╝║ ║║ ║║
	╝  ══╝╝ ╝ ╝   ╝  ══╝══╝══╝
	       COMPLETE
	`);

	process.exit(1);

};


/*
 * Single instance of the font processor
 */
const queueUp = () => {
	return new Promise(async (resolve) => {
		const font = $fontList.pop();

		if (!font) {
			resolve();
		}

		const PF = new ProcessFont(
			$DB,
			$paths,
			$programs,
			font,
			$moveFiles,
			false
		);
		await PF.process();
		resolve();
	});
}

/*
 * Instantiates the queue
 */
const processFonts = async () => {
	return new Promise(async (resolve) => {
		if ($fontList.length === 0) {
			resolve();
		}

		// instantiate a new agenda
		const agenda = new Agenda({
			db: { address: "mongodb://127.0.0.1/fontfool" },
			maxConcurrency: $queue,
			defaultConcurrency: 5
		});

		// define process_a_font
		agenda.define(
			"process_a_font",
			{ priority: "high" },
			async () => {
				await queueUp();
			}
		);
		// Run every 1 second
		agenda.every("1 second");

		agenda.on("complete", async () => {
			// look for unfinished jobs
			const jobs = await agenda.jobs(
				{ name: "process_a_font", lastFinishedAt: { $exists: false } }
			);

			console.log(`${jobs.length} Remaining Jobs`)

			// If there are no unfinished job, we're done
			if (jobs.length === 0) {
				console.log('Queue Is Empty');
				resolve();
			}
		});

		// setup the queue
		(async function () {
			await agenda.start();
			for (let i=0;i<$fontList.length;i++) {
				await agenda.schedule("now", "process_a_font");
			}
		})();
	});
}

/*
 * Clears the temp directory
 */
const clearTemp = async () => {
	return new Promise(async (resolve) => {
		// console.log('Clearing temp directory.');
		await rimraf.sync($paths.temp);
		resolve();
	});
};

/*
 * Sets up the outpaths and temp path
 */
const setupPaths = async () => {
	return new Promise(async (resolve) => {
		if (!fs.existsSync($paths.in)) {
			console.error(`${$paths.in} does not exist.`);
			process.exit(0);
		}

		$paths.in          = path.resolve($paths.in);
		$paths.out         = path.resolve($paths.out);
		$paths.outFonts    = `${$paths.out}/fonts`;
		$paths.outMetadata = `${$paths.out}/metadata`;
		$paths.outWoff     = `${$paths.out}/woff`;
		$paths.temp        = $temp;

		// Create the base output directories
		Object.keys($paths).forEach(path => {
			if (path === 'in') { return }
			mkdirp.sync($paths[path], { mode: '0755' });
			if (path === 'out' || path === 'temp') { return };

			// Make all sub directories: A/AA, A/AB, A/AC, etc
			// I'm sure there's a more graceful way of doing this, though
			// I rarely write these nested for loops so I'll keep it this way
			for (let i=0;i<27;i++) {
				const firstChr = (i<26) ? String.fromCharCode(65+i) : '#';
				for (let j=0;j<27;j++) {
					const secondChr = (j<26) ? String.fromCharCode(65+j) : '#';
					const sub = `${$paths[path]}/${firstChr}/${firstChr}${secondChr}`;
					// these are synchronous, but they go super fast
					mkdirp.sync(sub, { mode: '0755' })
				}
			}
		});

		// Create the base temp directory
		mkdirp.sync($temp, { mode: '0755' });

		resolve();
	});
};


foolInit();

