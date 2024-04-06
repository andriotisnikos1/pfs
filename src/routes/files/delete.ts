import { Request, Response } from "express";
import { dtb, s3 } from "../../central.config";
import { file } from "../../lib/types/interfaces/file";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const filesColl = dtb.collection<file>("files");

export default async (req: Request, res: Response) => {
    try {
        const deviceID = req.headers.authorization;
        let filepath = req.body.path as string;

        if (filepath.startsWith("/")) filepath = filepath.slice(1);
        else if (filepath.startsWith("./")) filepath = filepath.slice(2);

        const delCommand = new DeleteObjectCommand({
            Bucket: process.env.CF_BUCKET_NAME,
            Key: filepath
        });
        await s3.send(delCommand);

        await filesColl.deleteOne({
            path: filepath
        });

        res.status(200).json({
            status: "success"
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: "error",
            message: "Internal server error"
        });
    }
}

