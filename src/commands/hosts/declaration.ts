import { Command } from "commander";
import command_hostsAdd from "./add/declaration.js";
import command_hostsList from "./ls/declaration.js";
import command_hostsRemove from "./remove/declaration.js";
import command_hostsSwitch from "./switch/declaration.js";

const command_hosts = new Command("hosts")

command_hosts
  .description("Manage hosts")
  .addCommand(command_hostsAdd)
  .addCommand(command_hostsList)
  .addCommand(command_hostsRemove)
  .addCommand(command_hostsSwitch)


export default command_hosts;