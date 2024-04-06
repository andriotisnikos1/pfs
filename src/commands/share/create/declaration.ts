import { spinner } from "@clack/prompts";
import axios from "axios";
import { Command } from "commander";
import { config, serverURL } from "../../../central.config.js";

const command_shareCreate = new Command("create");

command_shareCreate
    .description("share a file")
    .argument("<path>", "The path to share")
    .option("-p, --password <password>", "The password to protect the file")
    .option("-e, --expires <expires>", "The expiration date of the file in seconds (Default: 1h - 3600s)")
    .option("-d, --downloads <maxDownloads>", "The number of downloads allowed")
    .action(async(path: string, options: {
        password?: string,
        expires?: string,
        maxDownloads?: string
    
    }) => {
        const s = spinner()
        s.start("Initializing share")
        const res = await axios.post<{
            status: "success" | "error",
            message?: string,
            shareID?: string
        }>(serverURL + "/share/init", {
            path,
            ...options
        }, {
            headers: {
                Authorization: config.server.authorization
            }
        })
        if (res.data.status === "error") {
            s.stop(res.data.message, 1)
            return
        }
        const url = (serverURL + "/share/download/" + res.data.shareID! + (options.password ? `?p=${options.password}` : "")).yellow
        s.stop(`Done! "${path}" can now be accesed via ${url}`)
    });

    export default command_shareCreate;