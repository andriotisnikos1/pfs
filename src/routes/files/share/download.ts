import { Request, Response } from 'express';
import { share } from '../../../lib/types/interfaces/share';
import { dtb, s3 } from '../../../central.config';
import crypto from "crypto"
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const shares = dtb.collection<share>("share")

export default async (req: Request, res: Response) => {
    try {
        const { shareID } = req.params
        let { password } = req.query
        if (!shareID) return res.status(400).json({ message: "Share ID is required", status: "error" })
        // password hash
        if (password) password = crypto.createHash("sha256").update(password as string).digest("hex")
        //get share
        const share = await shares.findOne({ shareID, password })
        if (!share) return res.status(404).json({ message: "Share not found", status: "error" })
        if (share.expires < Date.now()) return res.status(404).json({ message: "Share expired", status: "error" })
        if (share.maxDownloads && share.maxDownloads < 1) {
            await shares.deleteOne({ shareID })
            return res.status(404).json({ message: "Share expired", status: "error" })
        }
        // decrement maxDownloads
        if (share.maxDownloads) {
            await shares.updateOne({ shareID }, { $set: { maxDownloads: share.maxDownloads - 1 } })
        }
        // get remainder of expiry in seconds
        const expires = Math.floor((share.expires - Date.now()) / 1000)
        // create download link
        const cmd = new GetObjectCommand({
            Bucket: process.env.CF_BUCKET_NAME,
            Key: share.path
        })
        const url = await getSignedUrl(s3, cmd, { expiresIn: expires })
        res.redirect(url)

    } catch (error) {
        console.error(error)
    }
}