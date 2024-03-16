import { Config } from "../types/interfaces/Config.js"

export default async (): Promise<Config> => {
    return {
        server: {
            host: "fzff6k-8080.csb.app",
            port: 443,
            authorization: "password1234"
        },
        files: {
            upload: {
                chunkSize: 10 * 1024
            }
        }
    }
}