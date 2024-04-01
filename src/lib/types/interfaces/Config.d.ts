export interface Config {
    server: {
        host: string;
        port: number;
        authorization: string;
        protocol: "http" | "https"
    }
    files: {
        upload: {
            chunkSize: number;
        }
    }
}