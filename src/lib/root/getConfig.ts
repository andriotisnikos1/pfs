import { Config } from "../types/interfaces/Config.js"

export default async (): Promise<Config> => {
    return {
        server: {
            host: "fzff6k-8080.csb.app",
            port: 443,
            authorization: "device_token",
            protocol: "https"
        },
        files: {
            upload: {
                chunkSize: 6 * 1024
            }
        }
    }
}