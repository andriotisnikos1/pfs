import { spinner } from "@clack/prompts";
import _error from "../../../util/io/_error.js";
import verifyAndStat from "./verifyAndStat.js";
import { upload_procedure } from "../../../lib/types/namespaces/upload_procedure.js";
import axios from "axios";
import { config, serverURL } from "../../../central.config.js";
import fsp from "fs/promises";
import td from "@andriotis/triple-dot";



export default async function actions_filesUpload(file: string, options: { destination?: string }) {
    try {
        const { stats, uploadType, chunks } = await verifyAndStat(file)
        const s = spinner()
        const procedure = await axios.post<upload_procedure.Response>(serverURL+"/files/upload/init", {
            fileName: file.split("/").pop(),
            destination: options.destination ? options.destination.split("/").filter(p => p.length > 1).join("/") : "/",
            size: stats.size,
            uploadType,
            chunks
        })
        if (procedure.data.status.code === "rejected") {
            s.stop("Server error. Please check your deployment".red, 1);
            throw new Error();
        }
        s.start(`Chunking (1/${chunks})`.yellow);
        await fsp.mkdir(".pfs_chunks")
        await td({
            filePath: file,
            chunkSize: config.files.upload.chunkSize,
            outputDir: ".pfs_chunks",
            onProgress: async (chunkNumber) => {
                s.message(`Uploading (${chunkNumber! + 1}/${chunks})`.yellow)
                const buffer = await fsp.readFile(`.pfs_chunks/${chunkNumber}.chunk`)
                console.log(buffer)
                const url = procedure.data.presignedURLs.filter(p => p.part === chunkNumber! + 1)[0].url
                await axios.put(url, buffer, {
                    headers: {
                        "Content-Type": "application/octet-stream"
                    }
                })
                if (chunkNumber! + 1 !== chunks) s.message(`Chunking (${chunkNumber! + 2}/${chunks + 1})`.yellow)
            }
        })
        s.stop("Upload complete".green, 0)
    } catch (error) {
        _error(String(error), true);
    }
}

