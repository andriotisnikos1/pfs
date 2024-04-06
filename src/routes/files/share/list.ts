import { Request, Response } from "express";
import { share } from "../../../lib/types/interfaces/share";
import { dtb } from "../../../central.config";

const shares = dtb.collection<share>("share")

export default async (req: Request, res: Response) => {
    try {
        // todo: auth
        const sharesList = await shares.find().toArray()
        res.json({
            status: "success",
            list: sharesList
        })
    } catch (error) {
        console.error(error);
        res.json({
            status: "error",
            message: "Internal server error",
        });
    }
};