import { spinner } from "@clack/prompts";
import _error from "../../../util/io/_error.js";
import {getFileChunkStats} from "@andriotis/triple-dot"

export default async function verifyAndStat(file: string) {
    try {
        // stat file
        const s = spinner()
        s.start("Verifying file".yellow);

        const fcStats = await getFileChunkStats(file, 5 * 1024);
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
        const uploadType = stats.size > 5 * 1024 * 1024 ? "multipart" : "single";
        s.stop("File verified".green);
        return { stats, uploadType, chunks }
    } catch (error) {
        _error("Unable to verify file", true);
        process.exit(1);
    }

}