import { spinner } from "@clack/prompts";
import _error from "../../../util/io/_error.js";
import verifyAndStat from "./verifyAndStat.js";

export default async function actions_filesUpload(file: string, options: { destination?: string }) {
    try {
        const { stats, uploadType, chunks } = await verifyAndStat(file)
        const s = spinner()
    } catch (error) {
        _error(String(error), true);
    }
}

