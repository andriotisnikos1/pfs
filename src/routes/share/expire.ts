import { Request, Response } from "express";
import { share } from "../../lib/types/interfaces/share";
import { dtb } from "../../central.config";

const shares = dtb.collection<share>("share")

export default async (req: Request, res: Response) => {
    try {
        const deviceID = req.headers.authorization
        //todo: auth
        for (const shareID of req.body.shareIDs) await shares.deleteOne({shareID})
        res.json({
            status: "success",
        })
    } catch (error) {
        console.error(error);
        res.json({
            status: "error",
            message: "Internal server error",
        });
    }
}