const manual = `
╔══════════════════════════════════════════════════════════╗
║ FONT FOOL                                                ║
╠══════════════════════════════════════════════════════════╣
║ Sorts ttf, otf, woff files, this will auto-overwrite     ║
║ existing sorted files, so be careful.                    ║
║                                                          ║
║ --in        - path to the existing fonts                 ║
║ --out       - output path                                ║
║ --move      - (optional) move the files                  ║
║ --queue     - (optional) queue size 5 is default         ║
║ --ttcext    - (optional) extract ttc & dfont files       ║
║ --converter - (optional) convert pfb & fon files         ║
╚══════════════════════════════════════════════════════════╝
`;


exports.RTFM = (showIt) => {
	if (showIt) {
		console.log(manual);
		process.exit(0);
	}
};
