import { Command } from "commander";
import action_hostsAdd from "./action.js";




const command_hostsAdd = new Command("add");

command_hostsAdd
    .description("Add a host")
    .action(action_hostsAdd)


export default command_hostsAdd;