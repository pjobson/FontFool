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
    this.defaultText = "1234567890\n!@#$%^&*()\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque neque tortor, viverra id urna vitae, accumsan egestas enim. In ornare mattis posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse dignissim arcu justo, egestas faucibus urna bibendum non. Phasellus nisl lacus, aliquet a lorem eu, interdum pulvinar libero. Duis pharetra augue eget augue vestibulum dignissim. Nulla egestas commodo metus. Aliquam ac leo et augue mollis sollicitudin. Vestibulum ut ante nec diam porttitor euismod non nec nunc. Duis blandit pretium lacus nec rutrum. Sed condimentum pretium odio ac dignissim. Pellentesque pulvinar mi at elit mollis euismod. Maecenas eget placerat ipsum, in scelerisque lorem. Donec elementum urna id velit dapibus porta. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed ultrices sagittis nibh vel venenatis.";
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

}
