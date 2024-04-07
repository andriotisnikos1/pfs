import { select, spinner, text } from "@clack/prompts";
import axios from "axios";
import getFileConfig from "../../../lib/root/getFileConfig.js";
import { ConfigFile } from "../../../lib/types/interfaces/Config.js";
import { Server } from "../../../lib/types/interfaces/server.js";
import updateConfig from "../../../lib/root/updateConfig.js";

interface HostInput {
    name: string,
    host: string,
    port: string,
    protocol: "http" | "https",
    basicAuth: string
}

export default async function action_hostsAdd() {
    try {
        // input and ping
        const hostDetails = await getHostInput()
        const isHostAlive = await pingHost(hostDetails)
        // check validity and auth
        if (!isHostAlive) throw new Error("The host is not reachable")
        const host = await authWithHost(hostDetails)
        if (!host) return
        // save to config
        const s = spinner()
        s.start("Adding to config.json")
        const success = await saveHost(host)
        if (!success) {
            s.stop("An error occured while saving the host to config.json".red, 1)
            return
        }
        s.stop("Host added successfully")
    } catch (error) {
        console.error("An error occured while adding the host: " + String(error))
    }
}

async function saveHost(host: Server) {
    try {
        const cfg = await getFileConfig()
        if (!cfg) throw new Error("Failed to read config.json") 
        let newConfig = {
            ...cfg,
            serverList: [...cfg.serverList, host]
        } satisfies ConfigFile
        await updateConfig(newConfig)
        return true
    } catch (error) {
        return false
    }
}

// ping the host to check if it is a PFS server
async function pingHost(hostDetails: HostInput) {
    try {
        const { host, port, protocol } = hostDetails
        let s = spinner()
        s.start("Pinging the host")
        // send ping
        const ping = await axios.get<{
            status: "success" | "error",
            identification: "PFS Host - Personal File System",
            version: string
            authPermitted: boolean
        }>(`${protocol}://${String(host)}:${String(port)}/ping`)
        //ensure that the responce body has all the props - aka the server is a PFS server
        // object keys verification
        if (Object.keys(ping.data).find(k => !["status", "identification", "version", "authPermitted"].includes(k)
        )) throw new Error("The server is not a PFS server")
        // check for errors
        if (!ping.data.authPermitted) throw new Error("The server does not allow authentication")
        if (ping.data.status !== "success") throw new Error("The server is not responding")
        if (ping.data.identification !== "PFS Host - Personal File System") throw new Error("The server is not a PFS server")
        s.stop("Host is online and is a PFS server")
        return true
    } catch (error) {
        return false

    }

}

// get deviceID from host
async function authWithHost(hostDetails: HostInput) {
    try {
        const { host, port, protocol, basicAuth } = hostDetails
        const s = spinner()
        s.start("Authenticating with host")
        // send request to get deviceID
        const res = await axios.get<{
            deviceID?: string,
            status: "success" | "error",
            message?: string
        }>(`${protocol}://${String(host)}:${String(port)}/auth/init`, {
            headers: {
                Authorization: `Basic ${basicAuth}`
            }
        })
        // visuals and format
        if (res.data.status === "error") throw new Error(res.data.message)
        s.stop("Authenticated successfully")
        return {
            authorization: res.data.deviceID!,
            friendlyName: hostDetails.name,
            host: hostDetails.host,
            port: Number(hostDetails.port),
            protocol: hostDetails.protocol
        } satisfies Server
    } catch (error) {
        return null
    }
}


async function getHostInput() {
    const name = await text({ message: "Enter the name of the host" })
    const host = await text({ message: "Enter the host address or IP (eg. example.com or 192.168.1.1)" })
    const port = await text({ message: "Enter the port of the host", defaultValue: "443", placeholder: "443" })
    const protocol = await select({
        message: "Select the protocol", options: [{
            label: "http",
            value: "http"
        }, {
            label: "https",
            value: "https"
        }]
    })
    const username = await text({ message: "Enter the username for the host" })
    const password = await text({ message: "Enter the password for the host" })
    const basicAuth = Buffer.from(`${String(username)}:${String(password)}`).toString("base64")
    return { name, host, port, protocol, basicAuth } as HostInput
}