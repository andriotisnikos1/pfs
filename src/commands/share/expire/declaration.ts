import { multiselect, spinner } from "@clack/prompts";
import axios from "axios";
import { Command } from "commander";
import { config, serverURL } from "../../../central.config.js";
import _error from "../../../util/io/_error.js";
import { getListShare } from "../../files/getListShare.js";

const command_shareExpire = new Command("expire");

command_shareExpire
    .description("Expire a sharing link")
    .action(async () => {
        try {
            const vis = await getListShare()
            if (!vis) return
            const s = spinner()
            const visual = vis.list.map((share, index) => ({label: vis.visual[index], value: share.shareID}))
            // select shares to expire
            const choice = await multiselect({
                message: "Select a sharing link to expire",
                options: visual
            })
            if (!choice) return
            s.start("Expiring sharing link")
            // send request to server
            const res = await  axios.post<{
                status: "success" | "error"
                message?: string
            }>(serverURL + "/share/expire", {shareIDs: choice}, {
                headers: {
                    Authorization: config.server.authorization
                }
            })
            // output based on response
            switch (res.data.status) {
                case "success":
                    s.stop("Expired sharing links")
                    break;
                case "error":
                    s.stop("Failed to expire sharing link: ".red + res.data.message!.yellow, 1) 
                    break;
            
            }
        } catch (error) {
            _error("Failed to expire sharing link ".red + String(error).yellow, true)
        }
    });

export default command_shareExpire;