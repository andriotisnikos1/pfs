import "colors"
import getConfig from "./lib/root/getConfig.js";
import { Axios } from "axios";


export const config = await getConfig()
//todo: add config checks
if (!config.server) process.exit(1)

export const serverURL = (() => {
   if (config.server.protocol === "https" && config.server.port === 443) return `https://${config.server.host}`
    if (config.server.protocol === "http" && config.server.port === 80) return `http://${config.server.host}`
    return `${config.server.protocol}://${config.server.host}:${config.server.port}`
})()