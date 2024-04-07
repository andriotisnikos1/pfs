import axios from "axios";
import { config, serverURL } from "../../../central.config.js";
import fs from "fs";
import { spinner } from "@clack/prompts";
import { prettySize } from "../../../util/io/prettySize.js";

// checks if the folder path exists. if not, it creates it with parent folders
function checkFolder(path: string) {
    // get path with folders only
    const folders = path.split("/")
    folders.pop()
    //check recursively all folders. add to current to check if it exists
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
        // get presigned url for download from server
        const res = await axios.post<{
            status: "success" | "error",
            message?: string,
            url?: string,
            sizeInBytes?: number
        }>(serverURL + "/files/download", {
            path,
            chunkSize: 200
        }, {
            headers: {
                Authorization: config.server.authorization
            }
        })
        const url = res.data.url
        // check if response is valid
        if (res.data.status === "error" || !url) {
            s.stop(res.data.message, 1)
            return
        }
        // send request to server. to avoid buffer overflow, use stream
        const stream = await axios.get<fs.WriteStream>(url, {
            responseType: "stream"
        })

        s.message(`Downloading (0/${prettySize(res.data.sizeInBytes!)})`)
        let progress = 0
        // visuals - update progress by chunk size
        stream.data.on("data", (chunk: Buffer) => {
            progress += chunk.length
            s.message(`Downloading (${prettySize(progress)}/${prettySize(res.data.sizeInBytes!)})`)
        })
        stream.data.on("end", () => s.stop("Download complete!"))
        // check if output folder exists and pipe stream to file
        if (options.output) checkFolder(options.output)
        stream.data.pipe(fs.createWriteStream(options.output ?? path.split("/").pop()!))
    } catch (error) {
        console.error(error)
    }
}