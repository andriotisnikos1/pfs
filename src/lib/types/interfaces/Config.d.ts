import { Server } from "./server";

interface FilesConfig {
    files: {
        upload: {
            chunkSize: number;
        }
    }
}

export interface Config extends FilesConfig {
    server: Server;
}

export interface ConfigFile extends FilesConfig {
    server: Server | null;
    serverList: Server[]
}