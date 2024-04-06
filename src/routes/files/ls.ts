import { Request, Response } from 'express';
import { dtb, s3 } from "../../central.config"
import { LSFile, file } from '../../lib/types/interfaces/file';
import lsFileParser  from '../../util/processing/ls-file-parser'
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

const filesColl = dtb.collection<file>("files")

export default async function ls(req: Request, res: Response) {
    try {
        // todo: check for authorization via deviceID
        const deviceID = req.headers.authorization
        if (!deviceID) {
            res.json({status: "error", message: "Unauthorized"})
            return
        }
        // setup
        const prefix = req.body.prefix
        // get all file paths from db
        const files = await filesColl.find({path: {$regex: new RegExp(`^${prefix}`)}}).toArray()
        // parse to make compatible with s3 + make listing easier
        const parsed = lsFileParser(files.map((file: file) => "/" + file.path), prefix)
        // get s3 files
        const listObj = new ListObjectsV2Command({
            Bucket: process.env.CF_BUCKET_NAME!,
            Prefix: prefix
        })
        const s3Files = await s3.send(listObj)
        const lsFiles: LSFile[] = parsed.map(f => {
            // for nested files, remove the prefix
            if(prefix === "") f.fullPath = f.fullPath.slice(1)
            const s3File = s3Files.Contents?.find((s3File) => s3File.Key === f.fullPath)
            return {
                name: f.name,
                type: f.type,
                size: (s3File?.Size ?? 0),
            }
        })
        res.json({status: "success", files: lsFiles})
    } catch (error) {
        console.error(`Error in ls: ${error.message}`);
        res.json({status: "error", message: "An error occurred while listing files. Check the server logs for more information."})
    }
}