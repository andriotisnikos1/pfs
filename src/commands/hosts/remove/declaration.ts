import { multiselect, spinner } from "@clack/prompts";
import { Command } from "commander";
import { getHosts } from "../getHosts.js";
import getFileConfig from "../../../lib/root/getFileConfig.js";
import { ConfigFile } from "../../../lib/types/interfaces/Config.js";
import updateConfig from "../../../lib/root/updateConfig.js";
import axios from "axios";
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
            }) as string[]
            for (const host of choice) {
                const s = spinner()
                s.start("Removing host ".cyan + host.yellow)
                const removal = await removeHost(host)
                if (removal) s.stop(host.yellow + " removed")
                else s.stop("Failed to remove host".red + String(host).yellow,1)
            }
        } catch (error) {
            console.error("Failed to remove host".red + String(error).yellow)
        }
    })

async function removeHost(hostFriendlyName: string) {
    try {
        const config = await getFileConfig()
        if (!config) throw new Error("Failed to read config.json")
        const hostToRemove = config.serverList.find(h => h.friendlyName === hostFriendlyName)
        if (!hostToRemove) throw new Error("Host not found")
        const newConfig = {
            server: config.server?.friendlyName === hostFriendlyName ? null : config.server,
            serverList: config.serverList.filter(h => h.friendlyName !== hostFriendlyName),
            files: config.files
        } satisfies ConfigFile
        await updateConfig(newConfig)
        const res = await axios.delete<{
            status: "success" | "error",
            message?: string
        }>(`${hostToRemove.protocol}://${hostToRemove.host}:${hostToRemove.port}/auth/remove`, {
            headers: {
                Authorization: hostToRemove.authorization
            }
        })
        if (res.data.status === "error") throw new Error(res.data.message)
            return true
    } catch (error) {
        console.error("Failed to remove host ".red + String(error).yellow)
        return false
    }
}

export default command_hostsRemove;