// Angular
import { BrowserModule }           from '@angular/platform-browser';
import { CommonModule }            from '@angular/common';
import { NgModule }                from '@angular/core';
import { HttpClientModule }        from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent }            from './app.component';

import { MaterialModule }          from '@modules/material/material.module';

import { FontlistComponent }       from '@components/fontlist/fontlist.component';
import { HeaderComponent }         from '@components/header/header.component';
import { FooterComponent }         from '@components/footer/footer.component';
import { AFontComponent }          from '@components/afont/afont.component';
import { FavoritesComponent }      from '@components/favorites/favorites.component';
import { MarkerComponent }         from '@components/marker/marker.component';

import { Dec2chrPipe }             from '@pipes/dec2chr/dec2chr.pipe';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    FontlistComponent,
    HeaderComponent,
    FooterComponent,
    AFontComponent,
    Dec2chrPipe,
    FavoritesComponent,
    MarkerComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
