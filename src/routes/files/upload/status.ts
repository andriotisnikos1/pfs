import type { Request, Response } from "express";
import { dtb, s3 } from "../../../central.config";
import { Upload } from "../../../lib/types/interfaces/uploads";
import { AbortMultipartUploadCommand, CompleteMultipartUploadCommand, ListPartsCommand } from "@aws-sdk/client-s3";
import { file } from "../../../lib/types/interfaces/file";

const uploads = dtb.collection<Upload>("uploads");
const files = dtb.collection<file>("files");

type Status = "success" | "error";

/**
 * takes the authorization token (aka deviceID) and acts accordingly.
 * statuses: "success", "error"
 */
export default async (req: Request, res: Response): Promise<void> => {
  try {
    // check for authorization
    const deviceID = req.headers.authorization;
    const status = req.body.status as Status;
    if (!deviceID) {
      res.sendStatus(401);
      return;
    }
    // reset upload status that might affect the success of the upload
    const currentUpload = await uploads.findOne({deviceID});
    if (!currentUpload) {
      res.sendStatus(404);
      return;
    }
    // process status according to upload type
    switch (currentUpload.uploadType) {
      case "single":
        // update db - no action on s3 needed
        await uploads.deleteOne({deviceID});
        await files.insertOne({path: currentUpload.destination});
        res.json({status: "success"});
        return;
      case "multipart":
        // complete multipart upload on s3's side
        await processMultipartUpload(status, currentUpload);
        // update db
        await files.insertOne({path: currentUpload.destination});
        res.json({status: "success"});
        return;
    }
  } catch (error) {
    console.error("Error in upload.ts: ", error);
    res.send({status: "error", message: String(error)})
  }
};

async function processMultipartUpload(status: Status, upload: Upload) {
  try {
    const {uploadID, deviceID, destination} = upload;
    // get parts currently uploaded
    const getPartsCommand = new ListPartsCommand({
      Bucket: process.env.CF_BUCKET_NAME!,
      UploadId: uploadID,
      Key: destination
    });
    const parts = await s3.send(getPartsCommand);
    switch (status) {
      case "success":
        // complete multipart upload
        const completeCommand = new CompleteMultipartUploadCommand({
          Bucket: process.env.CF_BUCKET_NAME!,
          Key: destination,
          UploadId: uploadID,
          MultipartUpload: {
            Parts: parts.Parts?.map(part => ({PartNumber: part.PartNumber, ETag: part.ETag}))
          }
        });
        await s3.send(completeCommand);
        await uploads.deleteOne({deviceID});
        return true;
      case "error":
        // abort multipart upload
        const abortCommand = new AbortMultipartUploadCommand({
          Bucket: process.env.CF_BUCKET_NAME!,
          Key: destination,
          UploadId: uploadID
        })
        await s3.send(abortCommand);
        await uploads.deleteOne({deviceID});
        return true;
    }
  } catch (error) {
    console.error("Error in processMultipartUpload: ", error);
    return false
  }
}