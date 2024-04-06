import cors from "cors";
import express from "express";
import helmet from "helmet";
import "./central.config";
import root from "./routes/root";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({ origin: "*" }));

app.use("/", root);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  // const command = new ListMultipartUploadsCommand({
  //   Bucket: process.env.CF_BUCKET_NAME!,
  // });
  // const uploads = await s3.send(command);
  // // abort all
  // for (const upload of uploads.Uploads ?? []) {
  //   const cmd = new AbortMultipartUploadCommand({
  //     Bucket: process.env.CF_BUCKET_NAME!,
  //     Key: upload.Key!,
  //     UploadId: upload.UploadId!,
  //   });
  //   await s3.send(cmd);
  // }
});
