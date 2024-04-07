import { select } from "@clack/prompts";
import { Command } from "commander";
import { getHosts } from "../getHosts.js";
import getFileConfig from "../../../lib/root/getFileConfig.js";
import updateConfig from "../../../lib/root/updateConfig.js";
;

const command_hostsSwitch = new Command("switch");

command_hostsSwitch
    .description("Remove a host")
    .action(async () => {
        try {
            const hosts = await getHosts();
            const map = hosts.map((host, index) => ">> ".cyan + host.friendlyName.yellow + ` (${host.host})`.cyan)
            const visual = hosts.map((host, index) => ({ label: map[index], value: host.friendlyName }))
            const choice = await select({
                message: "Select the host to switch to",
                options: visual
            })
            await switchHost(String(choice))
        } catch (error) {
            console.error("Failed to remove host".red + String(error).yellow)
        }
    })

async function switchHost(host: string) {
    try {
        // get config
        const config = await getFileConfig()
        if (!config) throw new Error("Failed to read config.json")
        // get host details
        const hostToSwitchTo = config.serverList.find(h => h.friendlyName === host)
        if (!hostToSwitchTo) throw new Error("Host not found")
        // update config
        const newConfig = {
            ...config,
            server: hostToSwitchTo
        }
        await updateConfig(newConfig)
    } catch (error) {
        console.error("Failed to switch host ".red + String(error).yellow)
    }
}

export default command_hostsSwitch;