import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { FontDescription } from '@interfaces/font.type';
import { FontFull } from '@interfaces/font.type';

@Injectable({
  providedIn: 'root'
})
export class FontsService {
  fonts: FontDescription[] = [];
  font: FontFull;

  constructor(private httpClient: HttpClient){}

  /**
   * method for getting the font list
   * @function
   * @todo Make it get list from the DB
   * @todo Add reject handler to promise
   */
  getAll() {
    return new Promise(resolve => {
      this.httpClient.get<FontDescription[]>("../../assets/data/fontlist.json").subscribe(data =>{
        this.fonts = data;
        resolve(this.fonts);
      });
    });
  }

  /**
   * method for getting the favorites list
   * @function
   * @todo Make it get list from the DB
   * @todo Add reject handler to promise
   */
  getFavorites() {
    return new Promise(resolve => {
      this.httpClient.get<FontDescription[]>("../../assets/data/favorites.json").subscribe(data =>{
        this.fonts = data;
        resolve(this.fonts);
      });
    });
  }

  /**
   * gets one font dataset
   *   temporarily only  gets BitStream Vera Sans Mono
   * @function
   * @todo Make it get any font from the DB
   * @todo Add reject handler to promise
   */
  getOne(md5: string) {
    return new Promise(resolve => {
      this.httpClient.get<FontFull>("assets/data/Bitstream Vera Sans Mono - 37d8aff129ecd7d3fc495b7239f834db.json").subscribe(data =>{
        this.font = data;
        resolve(this.font);
      });
    });
  }


  /**
   * for marking this font as a favorite
   * @function
   * @param {string} md5 - md5sum of font to favorite
   * @todo implement this, will need to save to DB
   */
  favorite(md5: string) {
    //
  }

  /**
   * for marking this font as hidden
   * @function
   * @param {string} md5 - md5sum of font to hide
   * @todo implement this, will need to save to DB
   */
  hidden(md5: string) {
    //
  }

}
