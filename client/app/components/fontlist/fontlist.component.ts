import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { FontsService } from '@services/fonts/fonts.service';
import { FontDescription } from '@interfaces/font.type';
import { MaterialModule } from '@modules/material/material.module';


@Component({
  selector: 'fontlist',
  templateUrl: './fontlist.component.html',
  styleUrls: ['./fontlist.component.css']
})
export class FontlistComponent implements AfterViewInit {
  displayedColumns: string[] = ['actions', 'name', 'md5', 'size'];
  dataSource;
  fonts: FontDescription[] | any;
  resultsLength: number = 0;
  pageSize: number = 25;
  isLoadingResults: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private FontsSVC: FontsService
  ) { }

  /**
   * After View Init
   *   sets up the dataSource
   * @function
   */
  async ngAfterViewInit(): Promise<void> {
    this.fonts = await this.FontsSVC.getAll();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshDataSource();
  }

  /**
   * Refreshes the data source
   * @function
   * @todo Change to some kind of subscription model
   */
  refreshDataSource() {
    this.dataSource.data = this.fonts;
  }

  /**
   * Filters the fonts
   * @function
   * @param {Event} event - the event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Sets this font to favorite
   * @function
   * @param {string} md5sum - md5 of the font to set
   * @todo Call FontsSVC.favorite to save this to the DB
   */
  setFavorite(md5sum: string) {
    this.fonts.find((font, idx) => {
      if (font.md5 === md5sum) {
        this.fonts[idx].fav = !font.fav;
      }
    });
    this.refreshDataSource();
  }

  /**
   * Sets this font to hidden
   * @function
   * @param {string} md5sum - md5 of the font to set
   * @todo Call FontsSVC.hidden to save this to the DB
   * @todo Add some kind of button or switch to show all hidden fonts.
   */
  setHidden(md5sum: string) {
    this.fonts.find((font, idx) => {
      if (font.md5 === md5sum) {
        this.fonts[idx].hid = !font.hid;
      }
    });
    this.refreshDataSource();
  }

}
