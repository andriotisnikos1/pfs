import { Command } from "commander";
import { Server } from "../../../lib/types/interfaces/server.js";
import { getHosts } from "../getHosts.js";

const command_hostsList = new Command("ls");

command_hostsList
    .description("List all hosts")
    .action(async() => {
        const hosts = await getHosts();
        const table = hosts.map(host => {
            return {
                "Friendly Name": host.friendlyName,
                "Host": host.host,
                "Port": host.port,
                "Protocol": host.protocol
            }
        }
        )
        console.table(table);
    })



export default command_hostsList;