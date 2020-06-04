import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MediaLocation } from './model/MediaLocation'
import { ContentInfo } from './model/ContentInfo';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private globalContentInfo: Subject<ContentInfo> = new Subject();

  updateContentInfo(myContent: ContentInfo) {
    this.globalContentInfo.next(myContent);
  }

  getContentInfo(): Observable<ContentInfo> {
    return this.globalContentInfo.asObservable();
  }

  constructor(private http: HttpClient) { 
  }

  getMedia() {
    return this.http.get<any>('assets/Media/medialist.json')
      .toPromise()
      .then(res => <MediaLocation[]>res.data)
      .then(data => { return data; });
    }
}