const execSync = require('child_process').execSync;
const fs       = require('fs-extra');
const path     = require('path');

/*
 * Normalizes the font-config Data
 * @param {string} fcData - the fcscan stdout
 */
exports.get = async (thisFont, fcscan) => {
	// console.log(`FC-Scan: ${thisFont}`);
	const langjson = fs.readJsonSync(`${path.resolve('.')}/json/FontLanguages.json`);
	return new Promise(async (resolve, reject) => {
		const tmp = {};
		const out = {};
		// escape dollar signs
		thisFont = thisFont.replace(/\$/,"\\\$");
		const fcCmd  = `${fcscan} -b "${thisFont}"`;

		try {
			let fcData = await execSync(fcCmd).toString();

			fcData
				.replace(/\(.+?\)/g,'')
				.replace(/\t/g,'')
				.split(/\n/)
				.forEach(line => {
					if (/^Pattern has/.test(line)) return;
					if (/^charset/.test(line)) return;
					if (/^[a-f0-9]{4}:/.test(line)) return;
					if (line.length===0) return;
					if (line === '"') return;
					try {
						line = (line === "lang: ") ? 'lang: "en"' : line;
						line = line.replace(/[\r\n]/g,'');
						const [m, key, value] = line.match(/^(\w+): (.+)/);
						tmp[key] = value;
					} catch (er) {
						// do nothing
					}
				});

			out.color          = (tmp.color      === 'True');
			out.symbol         = (tmp.symbol     === 'True');
			out.decorative     = (tmp.decorative === 'True');
			out.scalable       = (tmp.scalable   === 'True');
			out.outline        = (tmp.outline    === 'True');

			out.index          = parseInt(tmp.index, 10);
			out.width          = parseInt(tmp.width, 10);
			out.weight         = parseInt(tmp.weight, 10);
			out.slant          = parseInt(tmp.slant, 10);

			out.foundry        = (tmp.foundry        || '').replace(/"/g,'');
			out.postscriptname = (tmp.postscriptname || '').replace(/"/g,'');
			out.fontformat     = (tmp.fontformat     || '').replace(/"/g,'');
			out.fontversion    = (tmp.fontversion    || '').replace(/"/g,'');

			out.languages      = tmp.lang.split('\|');
			out.languages      = out.languages.map( lang => langjson[lang] ? `${langjson[lang]} [${lang}]` : `Unknown [${lang}]` );
			out.languages.sort();

			out.style = {};
			out.family = {};
			out.fullname = {};

			// fix malformed tmp.family
			tmp.family = tmp.family || '"';
			if (tmp.family.match(/"/g).length === 1) {
				tmp.family = `"${tmp.family.trim().replace(/"/,'')}"`;
			}
			// fix malformed tmp.fullname
			tmp.fullname = tmp.fullname || '"';
			if (tmp.fullname.match(/"/g).length === 1) {
				tmp.fullname = `"${tmp.fullname.trim().replace(/"/,'')}"`;
			}

			// fix malformed tmp.style
			tmp.style = tmp.style || '"';
			if (tmp.style.match(/"/g).length === 1) {
				tmp.style = `"${tmp.style.trim().replace(/"/,'')}"`;
			}

			const styleArr        = (tmp.style && tmp.style.length > 2)               ? tmp.style.match(/"(.+?)"/g)        : [];
			const stylelangArr    = (tmp.stylelang && tmp.stylelang.length > 2)       ? tmp.stylelang.match(/"(.+?)"/g)    : ["zzz"];
			const familyArr       = (tmp.family && tmp.family.length > 2)             ? tmp.family.match(/"(.+?)"/g)       : [];
			const familylangArr   = (tmp.familylang && tmp.familylang.length > 2)     ? tmp.familylang.match(/"(.+?)"/g)   : ["zzz"];
			const fullnameArr     = (tmp.fullname && tmp.fullname.length > 2)         ? tmp.fullname.match(/"(.+?)"/g)     : [];
			const fullnamelangArr = (tmp.fullnamelang && tmp.fullnamelang.length > 2) ? tmp.fullnamelang.match(/"(.+?)"/g) : ["zzz"];

			styleArr.forEach((style, idx) => {
				const langIdx = stylelangArr[idx] ? stylelangArr[idx] : stylelangArr[0];
				out.style[langjson[langIdx.replace(/"/g,'')]] = style.replace(/"/g,'');
			});

			familyArr.forEach((family, idx) => {
				const langIdx = familylangArr[idx] ? familylangArr[idx] : familylangArr[0];
				out.family[langjson[langIdx.replace(/"/g,'')]] = family.replace(/"/g,'');
			});

			fullnameArr.forEach((fullname, idx) => {
				const langIdx = familylangArr[idx] ? familylangArr[idx] : familylangArr[0];
				out.fullname[langjson[langIdx.replace(/"/g,'')]] = fullname.replace(/"/g,'');
			});

			resolve(out);
		} catch (err) {
			reject(err);
		}
	});
}
