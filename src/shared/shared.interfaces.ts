import { ReadStream } from "fs";

export interface AvatarFile {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}
