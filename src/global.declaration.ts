import { program } from "commander";
import command_files from "./commands/files/declaration.js";

const commands = [command_files];

commands.forEach((command) => program.addCommand(command));