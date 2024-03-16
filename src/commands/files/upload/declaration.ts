import { Command } from "commander";
import actions_filesUpload from "./action.js";

const command_filesUpload = new Command("upload");

command_filesUpload
    .description("Upload a file to PFS")
    .argument("<file>", "The file to upload")
    .option("-d, --destination <destination>", "The destination path")
    .action(actions_filesUpload)

export default command_filesUpload;