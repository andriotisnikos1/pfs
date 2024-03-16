import { Command } from "commander";
import command_filesUpload from "./upload/declaration.js";

const command_files = new Command("files")

command_files.description("Manage files")
.addCommand(command_filesUpload)


export default command_files;