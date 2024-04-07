import { Request, Response } from "express"
import crypto from "crypto"
import { dtb } from "../../central.config"

const authColl = dtb.collection<{
    deviceID: string
}>("authorizations")

export default async (req: Request, res: Response) => {
    try {
        const deviceID = `sk_${crypto.randomBytes(16).toString("hex")}`
        const auth = req.headers.authorization
        if (!auth) return res.status(401).json({ message: "Unauthorized" })
        // auth is basic. get username and password
        const [username, password] = Buffer.from(auth.split(" ")[1], "base64").toString().split(":")
        if (!username || !password) return res.status(401).json({ message: "Unauthorized" })
        // check auth
        if (username !== process.env.AUTH_USERNAME || password !== process.env.AUTH_PASSWORD) return res.status(401).json({ message: "Unauthorized" })
        // auth is valid. save deviceID
        await authColl.insertOne({ deviceID })
        res.status(200).json({ deviceID, status: "success" })
    } catch (error) {
        console.error(error);
        res.send({
            status: "error",
            message: "An error occurred while processing your request. Please check the server deployment.",
        })
    }
}