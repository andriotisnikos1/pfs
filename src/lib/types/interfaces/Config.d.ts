export interface Config {
    server: {
        host: string;
        port: number;
        authorization: string;
    }
    files: {
        upload: {
            chunkSize: number;
        }
    }
}