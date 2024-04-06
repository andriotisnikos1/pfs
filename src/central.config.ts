import { S3Client } from "@aws-sdk/client-s3";
import checkRequiredEnv from "./util/core/checkRequiredEnv";
import { MongoClient } from "mongodb";

export const version = "0.0.1"
checkRequiredEnv();
export const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_AUTH_KEY_ID!,
    secretAccessKey: process.env.CF_AUTH_KEY_SECRET!,
  },
});

export const mongo = await MongoClient.connect(process.env.MONGO_URI!);
export const dtb = mongo.db("pfs");
