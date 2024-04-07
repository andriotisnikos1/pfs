import getFileConfig from "../../lib/root/getFileConfig.js";

export async function getHosts() {
    const config = await getFileConfig()
    if (!config) return []
    return config.serverList
}