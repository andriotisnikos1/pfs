import axios from "axios";
import { serverURL } from "../../../central.config.js";
import fs from "fs";
import { spinner } from "@clack/prompts";
import { prettySize } from "../../../util/io/prettySize.js";

function checkFolder(path: string) {
    const folders = path.split("/")
    folders.pop()
    let current = ""
    for (const folder of folders) {
        current += folder + "/"
        if (!fs.existsSync(current)) {
            fs.mkdirSync(current)
        }
    }
}

export default async function actions_filesDownload(path: string, options: { output?: string }) {
    try {
        const s = spinner()
        s.start("Initializing download")
        const res = await axios.post<{
            status: "success" | "error",
            message?: string,
            url?: string,
            sizeInBytes?: number
        }>(serverURL + "/files/download", {
            path,
            chunkSize: 200
        })
        const url = res.data.url
        if (res.data.status === "error" || !url) {
            s.stop(res.data.message, 1)
            return
        }
        const stream = await axios.get<fs.WriteStream>(url, {
            responseType: "stream"
        })
        s.message(`Downloading (0/${prettySize(res.data.sizeInBytes!)})`)
        let progress = 0
        stream.data.on("data", (chunk: Buffer) => {
            progress += chunk.length
            s.message(`Downloading (${prettySize(progress)}/${prettySize(res.data.sizeInBytes!)})`)
        })
        stream.data.on("end", () => s.stop("Download complete!"))
        if (options.output) checkFolder(options.output)
        stream.data.pipe(fs.createWriteStream(options.output ?? path.split("/").pop()!))
    } catch (error) {
        console.error(error)
    }
}