export interface Server {
    friendlyName: string;
    host: string;
    port: number;
    authorization: string;
    protocol: "http" | "https"
}