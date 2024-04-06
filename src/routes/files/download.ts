import { Request, Response } from "express"
import { dtb, s3 } from "../../central.config"
import { file } from "../../lib/types/interfaces/file"
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const filesColl = dtb.collection<file>("files")

export default async (req: Request, res: Response) => {
    try {
        const deviceID = req.headers.authorization
        let filepath = req.body.path as string
        // todo: auth
        // remove prefix / or ./
        if (filepath.startsWith("/")) filepath = filepath.slice(1)
        else if (filepath.startsWith("./")) filepath = filepath.slice(2)
        
        const file = await filesColl.findOne({ path: filepath })
        if (!file) return res.status(404).json({ message: "File not found" })
        
        // get file data
        const headCommand = new HeadObjectCommand({
            Bucket: process.env.CF_BUCKET_NAME,
            Key: file.path
        })
        const headResult = await s3.send(headCommand)
        const fileSize = headResult.ContentLength
        if (!fileSize) return res.status(404).json({ message: "File not found" })

        //get url
        const cmd = new GetObjectCommand({
            Bucket: process.env.CF_BUCKET_NAME,
            Key: file.path
        })
        const url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 60 * 24 })
        res.status(200).json({
            status: "success",
            url,
            sizeInBytes: fileSize
        })
    }catch (error) {
        console.error(error)
        res.json({
            status: "error",
            message: "Internal server error"
        })
    }
}

function byteEnd(index: number, chunkSize: number, fileSize: number) {
    const progress = index * chunkSize
    if (progress + chunkSize > fileSize) return fileSize - progress
    return chunkSize
}