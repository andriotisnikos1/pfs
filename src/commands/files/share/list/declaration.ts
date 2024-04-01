import { Command } from "commander";
import { getListShare } from "../../getListShare.js";


const command_filesShareList = new Command("list");

command_filesShareList
    .description("List shared files")
    .action(async () => {
        const vis = await getListShare()
        if (vis === undefined) return
        console.log(vis?.visual.join("\n"))
    });

export default command_filesShareList;

