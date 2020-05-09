import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { FileDownloaderService } from './../file-downloader.service';
import { MediaInfo } from './../model/MediaInfo';
import { LoadedContentInfo } from './../model/LoadedContentInfo';

@Component({
  selector: 'app-adaptive-player',
  templateUrl: './adaptive-player.component.html',
  styleUrls: ['./adaptive-player.component.scss']
})
export class AdaptivePlayerComponent implements OnInit {

  @ViewChild('videoPlayer', {
    read: ElementRef
  }) videoPlayer: ElementRef;

  constructor(
    private http: HttpClient,
    private downloader: FileDownloaderService
  ) {}

  // CONTENT INFO ON SITE //
  loadedContentInfo: LoadedContentInfo;
  // CONTENT INFO ON SITE END //

  // PLAYER SEGMENT //
  mediaSource = new MediaSource();
  mediaSourceUrl;
  sourceBuffer;
  segmentIndex = 0;
  // PLAYER SEGMENT END //

  // MEDIA SEGMENT //
  folderName: string = "Media/2";
  fileName: string = "mediainfo.json";
  videoSource = new Array;
  myMedia: MediaInfo;
  // MEDIA SEGMENT END //

  // ALGORITHM SEGMENT //
  speed: number = 0;
  percentDone: number = 0;
  actualSegmentLoaded: number = 0;
  // ALGORITHM SEGMENT END //

  ngOnInit() {
    this.loadedContentInfo = new LoadedContentInfo();
    this.loadedContentInfo.currentSpeed="unknown";
    this.loadedContentInfo.currentLoadingQuality="none";
  }

  // PLAYER METHODS SEGMENT //
  initPlayer() {
    const {
      nativeElement: videoPlayer
    } = this.videoPlayer;
    this.mediaSourceUrl = URL.createObjectURL(this.mediaSource);
    videoPlayer.src = this.mediaSourceUrl;

    this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen);
  }

  handleSourceOpen = () => {
    console.log("sourceopen EVENT -> handleSourceOpen");

    this.sourceBuffer = this.mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    this.loadUrlBlobToPlayer();
  }

  loadUrlBlobToPlayer() {
    const {
      nativeElement: videoPlayer
    } = this.videoPlayer;

    if (this.videoSource != null) {
      videoPlayer.setAttribute("src", this.videoSource[0]);
      this.segmentIndex = 1;
      this.videoPlayer.nativeElement.play();
      console.log("Odtwarzam video!");
    }
  }

  myEndEvent() {
    const {
      nativeElement: videoPlayer
    } = this.videoPlayer;

    if (this.segmentIndex < this.videoSource.length) {
      videoPlayer.setAttribute("src", this.videoSource[this.segmentIndex]);
      videoPlayer.play();
      this.segmentIndex++;
    } else {
      this.segmentIndex = 0;
      videoPlayer.setAttribute("src", this.videoSource[this.segmentIndex]);
      this.segmentIndex++;
    }
  }

  playPause() {
    const {
      nativeElement: videoPlayer
    } = this.videoPlayer;

    //videoPlayer.load();
    videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
  }
  // PLAYER METHODS SEGMENT END //

  // Read media details //
  getMediaInfo() {
    this.downloader.getMediaInfo(this.folderName, this.fileName).subscribe(event => {
      if (event instanceof HttpResponse) {
        var res: any = event.body;
        console.log("=========== (START) ODCZYT PLIKU: ===========")
        this.myMedia = JSON.parse(res);
        console.log(this.myMedia);
        console.log("=========== (KONIEC) ODCZYT PLIKU: ===========")

        if (this.myMedia != null) {
          console.log("myMedia wczytany, wywołuje getMedias(0)");
          this.getMedias(0);
        } else {
          console.log("Problem z plikiem MediaInfo");
        }
      }
    })
  }

  //huge function which download media content
  downloadMedia(mediaToDownload: string) {
    let startCount = true;
    let startTime;
    let endTime;

    this.downloader.getMedia(this.folderName, mediaToDownload).subscribe(async (event) => {

      if (event.type === HttpEventType.DownloadProgress) {

        if (startCount == true) {
          startTime = new Date().getTime();
          startCount = false;
        }

        this.percentDone = Math.round((100 * event.loaded) / event.total);
        console.log(`File ${mediaToDownload} is ${this.percentDone}% downloaded.`);

        if (this.percentDone === 100) {
          endTime = new Date().getTime();
          let duration = (endTime - startTime) / 1000;
          this.speed = event.total / duration
          console.log("SPEED: " + this.speed + "bps");
          this.percentDone = 0;

          let mbps = event.total / duration / 1000000;
          if (mbps < 1) {
            this.loadedContentInfo.currentSpeed = Math.round(event.total / duration / 1000) + " Kbps";
          } else {
            this.loadedContentInfo.currentSpeed = Math.round(mbps) + " Mbps";
          }
        }
      } else if (event instanceof HttpResponse) {
        var res: any = event.body; //to jest Blob
        this.videoSource.push(window.URL.createObjectURL(res)); //createObjectURL() convert the Blob to blob:URL
        console.log("Akutalnie załadowana ilość segmentów: " + this.videoSource.length + "/" + this.myMedia.files);
        this.getMedias(this.speed);

        //// play video after loaded 1 segment
        if (this.videoSource.length === 1) {
          this.initPlayer();
        }
      }
    });
  }
  ///////////////////////

  // Algorithm -> Adaptive stream, choose optimal quality for actual download speed
  getMedias(speedDownload: number) {
    if (this.actualSegmentLoaded == 0) {
      //Pierwszy segment ladujemy statycznie (jakosc posrednia czyli HD) i zmierzymy dla niej czas pobierania
      //jesli bedzie duza predkosc lacza kolejny segment zaladujemy FullHd, a jesli nizsza to SD
      this.downloadMedia(this.myMedia.HdFiles[this.actualSegmentLoaded].name)
      this.actualSegmentLoaded++;
      this.loadedContentInfo.currentLoadingQuality="HD 720p/24p";
      this.loadedContentInfo.allSegmentsQuality="HD";
    } else if (this.actualSegmentLoaded < this.myMedia.files) {
      //mnozymy predkosc pobierania na sekunde razy 10 (bo tyle trwaja segmenty wideo = 10s)
      //jesli predkosc pobierania jest wieksza od wielkosci segmentu to wybieramy wlasnie ta jakosc wideo
      if (speedDownload * 10 > this.myMedia.FullHdFiles[this.actualSegmentLoaded].sizeInBytes) {
        console.log("Algorytm wybrał jakość FullHD!");
        this.downloadMedia(this.myMedia.FullHdFiles[this.actualSegmentLoaded].name)
        this.actualSegmentLoaded++;
        this.loadedContentInfo.currentLoadingQuality="FullHD 1080p/24p";
        this.loadedContentInfo.allSegmentsQuality+=" | FullHD";
      } else if (this.speed * 10 > this.myMedia.HdFiles[this.actualSegmentLoaded].sizeInBytes) {
        console.log("Algorytm wybrał jakość HD!");
        this.downloadMedia(this.myMedia.HdFiles[this.actualSegmentLoaded].name)
        this.actualSegmentLoaded++;
        this.loadedContentInfo.currentLoadingQuality="HD 720p/24p";
        this.loadedContentInfo.allSegmentsQuality+=" | HD";
      } else {
        console.log("Algorytm wybrał jakość SD!");
        this.downloadMedia(this.myMedia.SdFiles[this.actualSegmentLoaded].name)
        this.actualSegmentLoaded++;
        this.loadedContentInfo.currentLoadingQuality="SD 360p/24p";
        this.loadedContentInfo.allSegmentsQuality+=" | SD";
      }
    } else {
      console.log("Załadowano wszystkie pliki!");
      console.log(this.videoSource);
    }
  }
}
