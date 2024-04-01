import { Command } from "commander";
import command_filesShareList from "./list/declaration.js";
import command_filesShareCreate from "./create/declaration.js";
import command_filesShareExpire from "./expire/declaration.js";

const command_filesShare = new Command("share");

command_filesShare
    .description("File sharing controls")
    .addCommand(command_filesShareList)
    .addCommand(command_filesShareCreate)
    .addCommand(command_filesShareExpire)


export default command_filesShare;