const spawnSync = require('child_process').spawnSync;
const path      = require('path');
const fs        = require('fs-extra');

/*
 * Normalizes the TTX Data
 * @param {string} thisFont - the font
 */
exports.get = async (md5sum, thisFont, paths, ttx) => {
	// console.log(`TTX Metadata: ${thisFont}`);
	return new Promise(async (resolve, reject) => {
		try {
			const thisTTX = `${paths.temp}/${Date.now()}.${md5sum}.ttx`;
			const ttxResult = spawnSync(ttx, [
				'-q', '-f', '-o', thisTTX,'-t', 'cmap', thisFont
			]);

			if (ttxResult.stderr.toString().length > 0) {
				reject(ttxResult.stderr.toString());
			}

			const out = [];
			fs
				.readFileSync(`${thisTTX}`)
				.toString()
				.replace(/<!--.+?-->/g,'')
				.replace(/ +</g,'<')
				.split('\n')
				.forEach(line => {
					if (!/^<map/.test(line)) return;
					let [x, hex, name] = line.match(/.+code="(.+?)".+?name="(.+?)"/);
					hex = hex.replace(/^0x/,'');
					dec = parseInt(hex, 16);
					fileformaturl = `https://www.fileformat.info/info/unicode/char/${hex}/index.htm`

					// ignore control characters
					if (dec >= 32) {
						out.push({ dec: dec, hex: hex, name: name });
					}
				});
			resolve([out, thisTTX]);
		} catch (er) {
			reject(er);
		}
	});
}

