import { Command } from "commander";
import { getListShare } from "../../files/getListShare.js";


const command_shareList = new Command("ls");

command_shareList
    .description("List shared files")
    .action(async () => {
        const vis = await getListShare()
        if (vis === undefined) return
        console.log(vis?.visual.join("\n"))
    });

export default command_shareList;

