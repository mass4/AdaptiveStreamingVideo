import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MediaListComponent } from './media-list/media-list.component';
import { AdaptivePlayerComponent } from './adaptive-player/adaptive-player.component';

@NgModule({
  declarations: [
    AppComponent,
    MediaListComponent,
    AdaptivePlayerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
