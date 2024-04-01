import { Command } from "commander";
import actions_filesDownload from "./action.js";

const command_filesDownload = new Command("download");

command_filesDownload
    .description("Download a file")
    .argument("<path>", "The path to download")
    .option("-o, --output <output>", "The output file")
    .action(actions_filesDownload);

export default command_filesDownload;