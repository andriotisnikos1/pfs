import axios from "axios";
import { Command } from "commander";
import { config, serverURL } from "../../../central.config.js";
import actions_filesLs from "./action.js";

const command_filesLs = new Command("ls");

command_filesLs
    .description("List files in a directory")
    .option("-p, --path <path>", "The path to list")
    .action(actions_filesLs)


export default command_filesLs;