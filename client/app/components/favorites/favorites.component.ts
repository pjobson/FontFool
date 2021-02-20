import { Component, AfterViewInit } from '@angular/core';

import { FontsService } from '@services/fonts/fonts.service';

import { FontDescription } from '@interfaces/font.type';


@Component({
  selector: 'favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements AfterViewInit {
  fonts: FontDescription[] | any;

  constructor(
    private FontsSVC: FontsService
  ) { }

  async ngAfterViewInit(): Promise<void> {
    this.fonts = await this.FontsSVC.getFavorites();
  }

}
