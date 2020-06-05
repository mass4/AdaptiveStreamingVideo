import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileDownloaderService {
  //url: string = "assets/Upload/SpeedTest_32MB.dat";
  url: string = 'assets/';

  constructor(private http: HttpClient) {}

  download(folderName: string, fileName: string, responseType: string) {
    const req = new HttpRequest('GET', this.url + folderName + '/' + fileName, {
      //responseType: "blob" as "json",
      responseType: responseType,
      reportProgress: true,
    });
    return this.http.request(req);
  }

  getMediaInfo(folderName: string, fileName: string) {
    const req = new HttpRequest('GET', this.url + folderName + '/' + fileName, {
      responseType: 'text' as 'json',
      reportProgress: true,
    });
    return this.http.request(req);
  }

  getMedia(folderName: string, fileName: string) {
    const req = new HttpRequest('GET', this.url + folderName + '/' + fileName, {
      responseType: 'blob',
      reportProgress: true,
    });
    return this.http.request(req);
  }
}
