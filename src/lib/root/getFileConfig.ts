import { log } from "@clack/prompts"
import fsp from "fs/promises"
import os from "os"
import { ConfigFile } from "../types/interfaces/Config.js"

const defaultConfig: ConfigFile = {
    server: null,
    files: {
        upload: {
            chunkSize: 6 * 1024
        }
    },
    serverList: []
}

//verify that os.homedir()/.pfs and os.homedir()/.pfs/config.json exists. if not, create them
async function verifyConfigFileExists(): Promise<void> {
    try {
        await fsp.access(`${os.homedir()}/.pfs/config.json`)
    } catch (e) {
        await fsp.mkdir(`${os.homedir()}/.pfs`)
        await fsp.writeFile(`${os.homedir()}/.pfs/config.json`, JSON.stringify(defaultConfig))
    }
}



export default async function getFileConfig(): Promise<ConfigFile | null> {
    const configFilePath = `${os.homedir()}/.pfs/config.json`
    await verifyConfigFileExists()
    let content = await fsp.readFile(configFilePath, { encoding: "utf-8" })
    let config: ConfigFile
    try {
        config = JSON.parse(content)
    } catch (e) {
        console.error("Error parsing config file")
        return null
    }
    //get argv after the first argument
    const whitelistCheck = process.argv.slice(2).join(" ")
    const whitelistedCommands = ["hosts add", "hosts switch"]
    if (!config.server && !whitelistedCommands.includes(whitelistCheck)) {
        log.warn("Hey there! It seems you haven't set up a server yet. Run `pfs hosts add` to add a server then `pfs hosts switch`.")
        process.exit(1)
    }
    return config
}