export interface IMediaAttributes {
  url: string;
  name: string;
  mime: string;
  size: number;
}

export interface IMedia {
  id: number;
  attributes: IMediaAttributes;
}

export interface IUploadedFile {
  id: number;
  name: string;
  url: string;
  mime: string;
  size: number;
}
