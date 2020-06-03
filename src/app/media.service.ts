import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MediaLocation } from './model/MediaLocation'

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http: HttpClient) { }

  getMedia() {
    return this.http.get<any>('assets/Media/medialist.json')
      .toPromise()
      .then(res => <MediaLocation[]>res.data)
      .then(data => { return data; });
    }
}