import { spinner } from "@clack/prompts";
import _error from "../../../util/io/_error.js";
import verifyAndStat from "./verifyAndStat.js";
import { upload_procedure } from "../../../lib/types/namespaces/upload_procedure.js";
import axios from "axios";
import { config, serverURL } from "../../../central.config.js";
import td from "@andriotis/triple-dot";
import { verifyAndStatResponce } from "../../../lib/types/interfaces/verifyAndStatResponce.js";



export default async function actions_filesUpload(file: string, options: { destination?: string }) {
    try {
        const vs = await verifyAndStat(file)
        const chunks = vs.chunks
        const s = spinner()
        //start the upload
        const procedure = await getProcedure(vs, file, s, options.destination)
        s.start(`Chunking (1/${chunks})`.yellow);
        //chunk and upload
        await td({
            //config
            filePath: file,
            chunkSize: config.files.upload.chunkSize,
            outputDir: ".pfs_chunks",
            passChunkToCallback: true,
            // upload on progress
            onProgress: async (chunkNumber, _, buffer) => {
                s.message(`Uploading (${chunkNumber! + 1}/${chunks})`.yellow)
                //get presigned url
                const url = procedure.data.presignedURLs.filter(p => p.part === chunkNumber! + 1)[0].url
                //upload
                await axios.put(url, buffer, {
                    headers: {
                        "Content-Type": "application/octet-stream"
                    }
                })
                // change message if not last chunk
                if (chunkNumber! + 1 !== chunks) s.message(`Chunking (${chunkNumber! + 2}/${chunks + 1})`.yellow)
            }
        })
        //report successful upload
        s.message("Finalizing".yellow)
        await reportStatus("success")
        s.stop("Upload complete".green, 0)
    } catch (error) {
        await reportStatus("error")
        _error(String(error), true);
    }
}

async function reportStatus(status: "success"| "error"){
    try {
        const res = await axios.post<{status: "success" | "error"}>(serverURL + "/files/upload/status", {
            status
        }, {
            headers: {
                Authorization: config.server.authorization
            }
        })
        if (res.data.status !== "success") throw new Error();
    } catch (error) {
        _error("Unable to report status", true);
        process.exit(1);
    }
}

async function getProcedure(vs: verifyAndStatResponce, file: string, s: ReturnType<typeof spinner>, destination?: string) {
        try {
            //deconstruct object
            const { stats, uploadType, chunks } = vs
            //get procedure details and check
            const procedure = await axios.post<upload_procedure.Response>(serverURL + "/files/upload/init", {
                fileName: file.split("/").pop(),
                destination: destination ? destination.split("/").filter(p => p.length > 1).join("/") : "",
                size: stats.size,
                uploadType,
                chunks
            }, {
                headers: {
                    Authorization: config.server.authorization
                }
            })
            if (procedure.data.status.code === "rejected") {
                s.stop("Server error. Please check your deployment".red, 1);
                throw new Error();
            }
            return procedure
        } catch (error) {
            await reportStatus("error")
            _error("Unable to get procedure", true);
            process.exit(1);
        }
}