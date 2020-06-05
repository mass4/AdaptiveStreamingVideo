import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MediaListComponent } from './media-list/media-list.component';
import { AdaptivePlayerComponent } from './adaptive-player/adaptive-player.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AppComponent, MediaListComponent, AdaptivePlayerComponent],
  imports: [BrowserModule, HttpClientModule, TableModule, ButtonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
