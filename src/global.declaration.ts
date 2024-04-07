import { program } from "commander";
import command_files from "./commands/files/declaration.js";
import command_share from "./commands/share/declaration.js";
import command_hosts from "./commands/hosts/declaration.js";

const commands = [command_files, command_share, command_hosts];

commands.forEach((command) => program.addCommand(command));