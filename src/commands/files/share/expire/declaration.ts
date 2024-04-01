import { select } from "@clack/prompts";
import { Command } from "commander";
import { getListShare } from "../../getListShare.js";

const command_filesShareExpire = new Command("expire");

command_filesShareExpire
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

        }
    });

export default command_filesShareExpire;