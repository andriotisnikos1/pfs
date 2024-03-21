import type { Request, Response } from "express";
import { dtb, s3 } from "../../../central.config";
import { Upload } from "../../../lib/types/interfaces/uploads";
import { AbortMultipartUploadCommand, CompleteMultipartUploadCommand, ListPartsCommand } from "@aws-sdk/client-s3";

const uploads = dtb.collection<Upload>("uploads");

type Status = "success" | "error";

/**
 * takes the authorization token (aka deviceID) and acts accordingly.
 * statuses: "success", "error"
 */
export default async (req: Request, res: Response): Promise<void> => {
  try {
    const deviceID = req.headers.authorization;
    const status = req.body.status as Status;
    if (!deviceID) {
      res.sendStatus(401);
      return;
    }
    const currentUpload = await uploads.findOne({deviceID});
    if (!currentUpload) {
      res.sendStatus(404);
      return;
    }
    console.log(status, currentUpload)
    switch (currentUpload.uploadType) {
      case "single":
        await uploads.deleteOne({deviceID});
        res.json({status: "success"});
        return;
      case "multipart":
        await processMultipartUpload(status, currentUpload);
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
    const getPartsCommand = new ListPartsCommand({
      Bucket: process.env.CF_BUCKET_NAME!,
      UploadId: uploadID,
      Key: destination
    });
    const parts = await s3.send(getPartsCommand);
    switch (status) {
      case "success":
        const completeCommand = new CompleteMultipartUploadCommand({
          Bucket: process.env.CF_BUCKET_NAME!,
          Key: destination,
          UploadId: uploadID,
          MultipartUpload: {
            Parts: parts.Parts?.map(part => ({PartNumber: part.PartNumber, ETag: part.ETag}))
          }
        });
        const res = await s3.send(completeCommand);
        console.log(res);
        await uploads.deleteOne({deviceID});
        return true;
      case "error":
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