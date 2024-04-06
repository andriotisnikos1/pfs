import { program } from "commander";
import command_files from "./commands/files/declaration.js";
import command_share from "./commands/share/declaration.js";

const commands = [command_files, command_share];

commands.forEach((command) => program.addCommand(command));