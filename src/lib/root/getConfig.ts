import { Config } from "../types/interfaces/Config.js"
import getFileConfig from "./getFileConfig.js"



export default async (): Promise<Config> => {
    const config = await getFileConfig()
    return {
        server: config!.server!,
        files: config!.files
    }
}

