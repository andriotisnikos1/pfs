import { dtb } from "../central.config"
import { Request, Response, NextFunction } from "express"

const authColl = dtb.collection<{
    deviceID: string
}>("authorizations")

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deviceID = req.headers.authorization
        const exists = await authColl.findOne({ deviceID })
        if (!exists) return res.status(401).json({ message: "Unauthorized" })
        next()
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}