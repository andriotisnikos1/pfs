import { Command } from "commander";
import command_filesUpload from "./upload/declaration.js";
import command_filesLs from "./ls/declaration.js";
import command_filesDownload from "./download/declaration.js";

const command_files = new Command("files")

command_files.description("Manage files")
.addCommand(command_filesUpload)
.addCommand(command_filesLs)
.addCommand(command_filesDownload)




export default command_files;