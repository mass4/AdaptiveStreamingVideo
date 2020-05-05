import {FileInfo} from './FileInfo';

export interface MediaInfo {
    files: number,
    lengthInSeconds: number;
    SdFiles: Array<FileInfo>;
    HdFiles: Array<FileInfo>;
    FullHdFiles: Array<FileInfo>;
}