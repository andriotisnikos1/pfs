import { select } from "@clack/prompts";
import { Command } from "commander";
import { getListShare } from "../../files/getListShare.js";
import _error from "../../../util/io/_error.js";

const command_shareExpire = new Command("expire");

command_shareExpire
    .description("Expire a sharing link")
    .action(async () => {
        try {
            const vis = await getListShare()
            if (!vis) return
            const visual = vis.list.map((share, index) => ({label: vis.visual[index], value: share.shareID}))
            const choice = await select({
                message: "Select a sharing link to expire",
                options: visual
            })
            console.log(choice)
        } catch (error) {
            _error("Failed to expire sharing link ".red + String(error).yellow, true)
        }
    });

export default command_shareExpire;