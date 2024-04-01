import { spinner } from "@clack/prompts";
import _error from "../../../util/io/_error.js";
import * as td from "@andriotis/triple-dot"
import { config } from "../../../central.config.js";
import { verifyAndStatResponce } from "../../../lib/types/interfaces/verifyAndStatResponce.js";

const { getFileChunkStats } = td

export default async function verifyAndStat(file: string): Promise<verifyAndStatResponce> {
    try {
        // stat file
        let s = spinner()
        s.start("Verifying file".yellow);

        const fcStats = await getFileChunkStats(file,config.files.upload.chunkSize);
        if (!fcStats) {
            s.stop("File not found".red,1);
            throw new Error();
        }
        const {stats, chunks} = fcStats
        
        //todo: if directory, tar and upload
        if (stats.isDirectory()) {
            s.stop("Directory detected".yellow,1);
            throw new Error();
        }
        if (!stats.isFile()) {
            s.stop("Not a file".red,1);
            throw new Error();
        }
        //get upload type
        const uploadType = stats.size > config.files.upload.chunkSize  * 1024 ? "multipart" : "single";
        s.stop("File verified".green);
        return { stats, uploadType, chunks }
    } catch (error) {
        _error("Unable to verify file", true);
        process.exit(1);
    }
}