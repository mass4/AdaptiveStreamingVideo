import { MediaLocation } from './MediaLocation';

export class ContentInfo {
    public shouldMediaShown: boolean = false;
    public mediaLocation: MediaLocation;

    constructor (shouldMediaShown: boolean, mediaLocation: MediaLocation){
        this.shouldMediaShown=shouldMediaShown;
        this.mediaLocation=mediaLocation;
    }
}