# Font Organizer

The Font Organizer currently consists of two tools:

* fontOrganizer.js - Organizes fonts moving or copying them to a sorted directory using a standard naming convention.
* fontIndexer.js - A program which scans a directory of sorted fonts and creates an index.

## Goals

* Rename fonts from garbage names to something useful.
* Create a directory of sorted fonts containing the renamed fonts.
* Have the ability to organize thousands of fonts.
* Create an index of fonts with their metadata.
* Create basic contact sheets for fonts.
* Convert PFB and FON files to TTF
* Extract [TTC (TrueType Collection)](https://en.wikipedia.org/wiki/TrueType#TrueType_Collection) and index their contents.

A huge problem with massive archives of fonts is duplication
of files, this script attempts to reduce duplication by use
of MD5 sums for removal of duplicates.

Files are renamed from `some_garbage_name.ttf` to `fullname - md5sum.ext`

Therefore if you have two exact files `Arial.ttf` and `AR____.ttf`,
the script will output as `Arial - 05ada5bd099c819f28fbe4a1de2f0a61.ttf`,
the second one overwriting the first one.

My goal was to be able to input a directory of various font
files and output to a sorted directory structure.

## Usage

### fontOrganizer.js

**WARNING:** Using the `--move` switch will move the files
from your `--in` path to your `--out` path, if you need to
retain the fonts in the original path, do not do this.

    ╔══════════════════════════════════════════════════════════╗
    ║                      FONT ORGANIZER                      ║
    ╠══════════════════════════════════════════════════════════╣
    ║ Sorts ttf, otf, woff files, this will auto-overwrite     ║
    ║ existing files, so be careful.                           ║
    ║ --in        - path to the existing fonts                 ║
    ║ --out       - output path                                ║
    ║ --move      - (optional) move the files                  ║
    ║ --queue     - (optional) queue size 5 is default         ║
    ║ --ttcext    - (optional) extract ttc files               ║
    ║ --converter - (optional) convert pfb & fon files         ║
    ╚══════════════════════════════════════════════════════════╝

## Required Programs

* `node` - Version 12.x or better.
* `fc-scan` - Part of the [Fontconfig](https://en.wikipedia.org/wiki/Fontconfig) suite.
* `fontforge` - For extracting TTC as well as converting FON & PFB files [Fontforge](https://en.wikipedia.org/wiki/FontForge)

## Use

    node fontOrganizer.js --in /path/to/unorganized_font_directory --out /path/to/organized_font_directory

Organizes fonts by as such:

    /out_path
             /first_letter
                          /first_two_letters
                                            /font_name - md5.ext

For Example: `/path/to/out/A/AR/Arial - 05ada5bd099c819f28fbe4a1de2f0a61.ttf`

### fontIndexer.js


### Required Programs

* fc-scan  - Part of [fontconfig](https://www.freedesktop.org/wiki/Software/fontconfig/) should be installed by default in your distro.
* ttx      - Part of [fonttools](https://github.com/fonttools/fonttools), installed with `pip install fonttools` or `pip3 install fonttools`
* stat     - Should be installed by default with your distro.
* file     - Should be installed by default with your distro.
* mimetype - Should be installed by default with your distro.
* md5sum   - Should be installed by default with your distro.
* ImageMagick - You'll need at least [Version 7](https://imagemagick.org/script/download.php).
    * convert
    * identify
* optipng  - [OptiPNG](http://optipng.sourceforge.net/): Advanced PNG Optimizer

