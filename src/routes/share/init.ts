import { Request, Response } from "express";
import { dtb } from "../../central.config";
import { file } from "../../lib/types/interfaces/file";
import { share } from "../../lib/types/interfaces/share";
import crypto from "crypto"

const shares = dtb.collection<share>("share")
const filesColl = dtb.collection<file>("files")



export default async (req: Request, res: Response) => {
    try {
        //todo: auth
        const { path } = req.body as share
        if (!path) return res.status(400).json({ message: "Path is required", status: "error" })
        // check if file exists
        const file = await filesColl.findOne({ path })
        if (!file) return res.status(404).json({ message: "File not found", status: "error" })
        // create share
        const shareID = `share_${crypto.randomBytes(8).toString("hex")}`
        await shares.insertOne({
            shareID,
            path,
            password: req.body.password ? crypto.createHash("sha256").update(req.body).digest("hex") : undefined,
            timestamp: Date.now(),
            maxDownloads: req.body.maxDownloads || undefined,
            expires: req.body.expires ? Date.now() + req.body.expires * 1000 : Date.now() + 1000 * 60 * 60,
        })
        return res.status(200).json({ status: "success", shareID })
    } catch (error) {
        console.error(error)
        res.json({
            status: "error",
            message: "Internal server error"
        })
    }
}