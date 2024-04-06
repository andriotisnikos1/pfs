import axios from "axios";
import { share } from "../../lib/types/interfaces/share.js"
import { spinner } from "@clack/prompts";
import { serverURL } from "../../central.config.js"

export async function getListShare() {
    try {
        const s = spinner()
        s.start("Fetching shared files")
        const res = await axios.get<{
            list?: share[]
            status: "success" | "error"
            message?: string
        }>(serverURL + "/share/list")
        if (res.data.status === "error") {
            s.stop(res.data.message, 1)
            return
        }
        s.stop()
        const visual = res.data.list!.map((share, index) => {
            const base = ">> ".cyan + share.path + " | "
            const hasPassword = share.password ? "Password protected".yellow : "No password".yellow
            const hasExpiry = (share.expires ? "Expires on " + new Date(share.expires).toLocaleString() : "No expiry").green
            const hasDownloadLimit = (share.maxDownloads ? "Max downloads: " + share.maxDownloads.toString() : "No download limit").blue
            return base + hasPassword + " " + hasExpiry + " " + hasDownloadLimit
        })
        return {visual, list: res.data.list!}
    } catch (error) {
        console.error(error);
        return null
    }
}