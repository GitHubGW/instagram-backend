import { ReadStream } from "fs";

export interface CommonResult {
  ok: boolean;
  message: string;
}

export interface AvatarFile {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}
