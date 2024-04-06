import { CreateMultipartUploadCommand, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../../../central.config";

export async function getMultipartURLs(amount: number, destination: string) {
    try {
      const urls: { part: number; url: string }[] = [];
      // create multipart upload
      const createMultipart = new CreateMultipartUploadCommand({
        Bucket: process.env.CF_BUCKET_NAME,
        Key: destination,
      });
      const multipart_res = await s3.send(createMultipart);
      if (!multipart_res.UploadId)
        throw new Error("Failed to create multipart upload");
      // get presigned urls
      for (let i = 0; i < amount; i++) {
        // command
        const uploadCommand = new UploadPartCommand({
          Bucket: process.env.CF_BUCKET_NAME,
          Key: destination,
          UploadId: multipart_res.UploadId,
          PartNumber: i + 1,
        });
        // get presigned url
        const presigned = await getSignedUrl(s3, uploadCommand, {
          expiresIn: 3600,
        });
        urls.push({ part: i + 1, url: presigned });
      }
      return { urls, uploadID: multipart_res.UploadId };
    } catch (error) {
      return null
    }
  }