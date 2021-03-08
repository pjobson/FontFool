import { Component, AfterViewInit, Input } from '@angular/core';
declare let FontFace: any;

import { FontFull } from '@interfaces/font.type';
import { FontsService } from '@services/fonts/fonts.service';

@Component({
  selector: 'afont',
  templateUrl: './afont.component.html',
  styleUrls: ['./afont.component.css']
})
export class AFontComponent implements AfterViewInit {
  @Input() md5sum: string;
  font: FontFull | any = false;
  defaultText: string;
  blockArray: number[] = [0];

  constructor(
    private FontsSVC: FontsService
  ) {
    // I know I could have used backtick for this, I just like it the old way for no particular reason.
    this.defaultText  = "1234567890\n";
    this.defaultText += "!@#$%^&*()\n";
    this.defaultText += "Sphinx of black quartz, judge my vow.\n";
    this.defaultText += "Jackdaws love my big sphinx of quartz.\n";
    this.defaultText += "Pack my box with five dozen liquor jugs.\n";
    this.defaultText += "The quick onyx goblin jumps over the lazy dwarf.\n";
    this.defaultText += "Cwm fjord bank glyphs vext quiz.\n";
    this.defaultText += "How razorback-jumping frogs can level six piqued gymnasts!\n";
    this.defaultText += "Cozy lummox gives smart squid who asks for job pen.";
  }

  /**
   * Run On Init
   * @function
   */
  async ngAfterViewInit(): Promise<void> {
    this.font = await this.FontsSVC.getOne(this.md5sum);

    this.blockArray = Array(Math.ceil(this.font.charset.length/10)).fill(0);

    // faceName is the name for @font-face
    // I'm making it the md5sum for simplicity
    this.font.faceName = `'${this.font.md5sum}'`;
    // todo: generate this path
    const fontpath = '/assets/data/Bitstream Vera Sans Mono - 37d8aff129ecd7d3fc495b7239f834db.woff';
    let customFont = new FontFace(this.font.faceName, `url('${fontpath}') format("woff")`);
    customFont.load().then((res) => {
      document['fonts'].add(res);
    }).catch((error) => {
      console.log(error)
    });
  }

  /**
   * Text selecter.
   * @function
   */
  selectText(ev) {
    ev.target.select();
  }

}
