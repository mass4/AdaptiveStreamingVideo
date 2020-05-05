import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FileDownloaderService } from './../file-downloader.service';
import { MediaLocation } from './../model/MediaLocation';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private downloader: FileDownloaderService
  ) {

  }

  mediaLocations: Array < MediaLocation > ;
  folderName = "Media";
  fileName = "medialist.txt";

  ngOnInit() {
    this.getMediaLocations(this.folderName, this.fileName);
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
