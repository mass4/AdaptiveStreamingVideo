import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FileDownloaderService } from './../file-downloader.service';
import { MediaLocation } from './../model/MediaLocation';
import { MediaService } from './../media.service'

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {

  media: MediaLocation[];
  cols: any[];

  constructor(
    private http: HttpClient,
    private downloader: FileDownloaderService,
    private mediaService: MediaService
  ) {

  }

  mediaLocations: Array < MediaLocation > ;
  folderName = "Media";
  fileName = "medialist.json";

  ngOnInit() {
    this.getMediaLocations(this.folderName, this.fileName);

    this.mediaService.getMedia().then(media => this.media = media);

        this.cols = [
            { field: 'title', header: 'Title' }
        ];
  }

  getMediaLocations(folderName: string, fileName: string) {
    this.downloader.getMediaInfo(folderName, fileName).subscribe(event => {
      if (event instanceof HttpResponse) {
        var res: any = event.body;
        this.mediaLocations = JSON.parse(res);


        // (do Bartka): console.log TYLKO DO TESTOW WYSWIETLENIE, ZEBYS WIDZIAL GDZIE SĄ DANE POTEM MOZNA USUNĄC
        console.log("getMediaLocations() => mediaLocations: ", this.mediaLocations);
        this.mediaLocations.forEach(mediaLocation => {
          console.log("title: ", mediaLocation.title);
        })
        /////////////////////////////////////////////////////////////////////////////////////////////////////////
      }
    })
  }
}