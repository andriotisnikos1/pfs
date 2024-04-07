import { select } from "@clack/prompts";
import { Command } from "commander";
import { getHosts } from "../getHosts.js";
;

const command_hostsSwitch = new Command("switch");

command_hostsSwitch
    .description("Remove a host")
    .action(async() => {
        try {
            const hosts = await getHosts();
            const map = hosts.map((host, index) => ">> ".cyan + host.friendlyName.yellow + ` (${host.host})`.cyan)
            const visual = hosts.map((host, index) => ({label: map[index], value: host.friendlyName}))
            const choice = await select({
                message: "Select the host to switch to",
                options: visual
            })
            // todo: switch to host
        } catch (error) {
            console.error("Failed to remove host".red + String(error).yellow)
        }
    })

export default command_hostsSwitch;