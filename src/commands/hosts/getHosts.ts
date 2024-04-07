import { Server } from "../../lib/types/interfaces/server";

export async function getHosts() {
    return [
        {
            authorization: "device_token",
            friendlyName: "main",
            host: "coding",
            port: 8080,
            protocol: "http"
        }
    ] satisfies Server[]
}