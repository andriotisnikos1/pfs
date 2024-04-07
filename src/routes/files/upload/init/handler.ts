import {
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Request, Response } from "express";
import { dtb, s3 } from "../../../../central.config";
import { Upload } from "../../../../lib/types/interfaces/uploads";
import { upload_procedure } from "../../../../lib/types/namespaces/upload_procedure";
import { getMultipartURLs } from "./getMultipartURLs";

const uploads = dtb.collection<Upload>("uploads");

const oneMBInBytes = 1024 * 1024;

export default async (
  req: Request,
  res: Response,
): Promise<upload_procedure.Response> => {
  try {
    // init + auth
    const body = req.body as upload_procedure.Request;
    const deviceID = req.headers.authorization;
    if (!deviceID) throw new Error("Missing deviceID (authorization header)");
    // reset any previous uploads
    await uploads.deleteMany({deviceID});
    
    // check destination for leading slash
    if (body.destination.startsWith("/")) body.destination = body.destination.slice(1)
    const Key = body.destination === "" ? body.fileName : body.destination
    //minimum multipart 6MB. check with total size
    if(body.uploadType === "multipart" && body.size < oneMBInBytes * 6) throw new Error("Multipart upload requires a minimum of 6MB")
    // switch on upload type
    switch (body.uploadType) {
      case "single":
        // get presigned url for single upload
        const uploadCommand = new PutObjectCommand({
          Bucket: process.env.CF_BUCKET_NAME,
          Key
        });
        const presigned = await getSignedUrl(s3, uploadCommand, {
          expiresIn: 3600,
        })
        // save that deviceID initiated this upload
        await saveUpload(deviceID, body.destination, body.uploadType, Key);
        return {
          presignedURLs: [{ part: 1, url: presigned }],
          status: {
            code: "accepted",
          },
        };
      case "multipart":
        // get presigned urls for multipart upload
        const res = await getMultipartURLs(body.chunks, Key);
        if (!res) throw new Error("Failed to get multipart URLs");
        const { urls, uploadID } = res;
        //save and return
        await saveUpload(deviceID, uploadID, body.uploadType, Key);
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

