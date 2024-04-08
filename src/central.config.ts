import "colors"
import getConfig from "./lib/root/getConfig.js";
import { log } from "@clack/prompts";
import { argv } from "process";


export const config = await getConfig()

if (!process.argv.join(" ").includes("pfs hosts") || !process.argv.includes("add")) 
log.info("Using host: " + config.server.friendlyName.yellow + " " + `(${config.server.host})`.cyan)

export const serverURL = (() => {
    if (process.argv.join(" ").includes("pfs hosts")) return ""
   if (config.server.protocol === "https" && config.server.port === 443) return `https://${config.server.host}`
    if (config.server.protocol === "http" && config.server.port === 80) return `http://${config.server.host}`
    return `${config.server.protocol}://${config.server.host}:${config.server.port}`
})()