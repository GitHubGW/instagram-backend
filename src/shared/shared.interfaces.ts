import { ReadStream } from "fs";

export interface CommonResult {
  ok: boolean;
  message: string;
  id?: number;
}

export interface AvatarFile {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}
