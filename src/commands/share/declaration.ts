import { Command } from "commander";
import command_shareList from "./list/declaration.js";
import command_shareCreate from "./create/declaration.js";
import command_shareExpire from "./expire/declaration.js";

const command_share = new Command("share");

command_share
    .description("File sharing controls")
    .addCommand(command_shareList)
    .addCommand(command_shareCreate)
    .addCommand(command_shareExpire)


export default command_share;