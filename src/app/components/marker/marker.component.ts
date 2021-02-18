import { Component, AfterViewInit, Input } from '@angular/core';

import { FontFull } from '@interfaces/font.type';


@Component({
  selector: 'marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.css']
})
export class MarkerComponent implements AfterViewInit {
  @Input() font: FontFull;

  constructor() { }

  ngAfterViewInit(): void {
    console.log(this.font);
  }

  /**
   * Sets this font to favorite
   * @function
   * @param {string} md5sum - md5 of the font to set
   * @todo Call FontsSVC.favorite to save this to the DB
   */
  setFavorite(md5sum: string) {
    // this.fonts.find((font, idx) => {
    //   if (font.md5 === md5sum) {
    //     this.fonts[idx].fav = !font.fav;
    //   }
    // });
  }

  /**
   * Sets this font to hidden
   * @function
   * @param {string} md5sum - md5 of the font to set
   * @todo Call FontsSVC.hidden to save this to the DB
   * @todo Add some kind of button or switch to show all hidden fonts.
   */
  setHidden(md5sum: string) {
    // this.fonts.find((font, idx) => {
    //   if (font.md5 === md5sum) {
    //     this.fonts[idx].hid = !font.hid;
    //   }
    // });
  }

}
