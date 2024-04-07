import { Request, Response } from "express";
import { dtb } from "../../central.config";

const authColl = dtb.collection<{
    deviceID: string
}>("authorizations")

export default async (req: Request, res: Response) => {
    try {
        const deviceID = req.headers.authorization
        if (!deviceID) return res.json({ message: "Unauthorized", status: "error" })
        const exists = await authColl.findOne({ deviceID })
        if (!exists) return res.json({ message: "Unauthorized", status: "error" })
        await authColl.deleteOne({ deviceID })
        res.status(200).json({ status: "success" })
    } catch (error) {
        console.error(error);
        res.json({ status: "error", message: "Internal server error" })
    }
};