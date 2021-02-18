import { Component, AfterContentInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MaterialModule } from '@modules/material/material.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class AppComponent implements AfterContentInit {
  hashRef: string | boolean = false;

  constructor(
    private location: Location
  ) { }

  /**
   * Run After Content Init
   *   or it'll throw a ExpressionChangedAfterItHasBeenCheckedError
   * @function
   */
  ngAfterContentInit() {
    this.testPath();
    this.location.onUrlChange((path, state) => {
      if (path && state === null) {
        this.testPath();
      }
    });
  }

  /**
   * Tests the path and sets the hashRef
   * @function
   */
  testPath() {
    const md5 = this.location.path(true).match(/[a-f0-9]{32}/);
    if (!md5) {
      this.hashRef = false;
    } else {
      this.hashRef = md5[0];
    }
  }
}
