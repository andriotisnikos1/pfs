import { multiselect } from "@clack/prompts";
import { Command } from "commander";
import { getHosts } from "../getHosts.js";
;

const command_hostsRemove = new Command("remove");

command_hostsRemove
    .description("Remove a host")
    .action(async() => {
        try {
            const hosts = await getHosts();
            const map = hosts.map((host, index) => ">> ".cyan + host.friendlyName.yellow + ` (${host.host})`.cyan)
            const visual = hosts.map((host, index) => ({label: map[index], value: host.friendlyName}))
            const choice = await multiselect({
                message: "Select the hosts to remove",
                options: visual
            })
            // todo: remove host
        } catch (error) {
            console.error("Failed to remove host".red + String(error).yellow)
        }
    })

export default command_hostsRemove;