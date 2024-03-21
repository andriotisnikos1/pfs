import type { Request, Response } from "express";
import { upload_procedure } from "../../../lib/types/namespaces/upload_procedure";
import {
  CreateMultipartUploadCommand,
  PutObjectCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { dtb, s3 } from "../../../central.config";
import { Upload } from "../../../lib/types/interfaces/uploads";

const uploads = dtb.collection<Upload>("uploads");

export default async (
  req: Request,
  res: Response,
): Promise<upload_procedure.Response> => {
  try {
    // init
    const body = req.body as upload_procedure.Request;
    const deviceID = req.headers.authorization;
    if (!deviceID) throw new Error("Missing deviceID (authorization header)");
    switch (body.uploadType) {
      case "single":
        // get presigned url for single upload
        const uploadCommand = new PutObjectCommand({
          Bucket: process.env.CF_BUCKET_NAME,
          Key: body.destination,
        });
        const presigned = await getSignedUrl(s3, uploadCommand, {
          expiresIn: 3600,
        })
        await saveUpload(deviceID, body.destination, body.uploadType, body.destination);
        return {
          presignedURLs: [{ part: 1, url: presigned }],
          status: {
            code: "accepted",
          },
        };
      case "multipart":
        // get presigned urls for multipart upload
        const res = await getMultipartURLs(body.chunks, body.destination);
        if (!res) throw new Error("Failed to get multipart URLs");
        const { urls, uploadID } = res;
        await saveUpload(deviceID, uploadID, body.uploadType, body.destination);
        return {
          presignedURLs: urls,
          status: {
            code: "accepted",
          },
        };
      default:
        throw new Error("Invalid upload type");
    }
  } catch (error) {
    console.error("Error in upload.ts: ", error);
    return {
      presignedURLs: [],
      status: {
        code: "rejected",
        error: String(error),
      },
    };
  }
};

async function saveUpload(deviceID: string, uploadID: string, uploadType: "single" | "multipart", destination: string) {
  try {
    await uploads.insertOne({ deviceID, uploadID, uploadType, timestamp: Date.now(), destination});
  } catch (error) {
    console.error("unable to save upload to db")
  }
}

async function getMultipartURLs(amount: number, destination: string) {
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