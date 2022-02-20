import AWS from "aws-sdk";
import { ReadStream } from "fs";
import { AvatarFile } from "./shared.interfaces";

const s3: AWS.S3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const handleUploadFileToS3 = async (uploadedFile: any, foldername: string, username: string): Promise<string> => {
  try {
    const { filename, createReadStream }: AvatarFile = uploadedFile.file;
    const newFilename: string = `${Date.now()}-${filename}`;
    const readStream: ReadStream = createReadStream();
    const { Location }: AWS.S3.ManagedUpload.SendData = await s3
      .upload({
        Bucket: "instagram-gw-bucket",
        Key: `${foldername}/${username}/${newFilename}`,
        Body: readStream,
        ACL: "public-read-write",
      })
      .promise();
    return Location;
  } catch (error) {
    console.log("handleUploadFileToS3 error");
    return "";
  }
};

export const handleDeleteFileFromS3 = async (fileUrl: string): Promise<void> => {
  try {
    const decodedFileUrl: string = decodeURI(fileUrl);
    const fileKey: string = decodedFileUrl.split("amazonaws.com/")[1];
    await s3
      .deleteObject({
        Bucket: "instagram-gw-bucket",
        Key: fileKey,
      })
      .promise();
  } catch (error) {
    console.log("handleDeleteFileFromS3 error");
  }
};
