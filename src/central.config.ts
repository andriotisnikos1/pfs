import "colors"
import getConfig from "./lib/root/getConfig.js";
import { Axios } from "axios";


export const config = await getConfig()
//todo: add config checks
if (!config.server) process.exit(1)

export const serverURL = "https://" + config.server.host + ":" + config.server.port