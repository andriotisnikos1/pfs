import axios from "axios"
import { config, serverURL } from "../../../central.config.js"
import { prettySize } from "../../../util/io/prettySize.js"

interface Res {
    status: "success" | "error",
    message?: string,
    files?: {
        name: string,
        type: "file" | "directory",
        size: number
    
    }[]
}

export default async function actions_filesLs(options: {path?: string})  {
    const res = await axios.post<Res>(serverURL + "/files/ls", {
        prefix: options.path ?? ""
    }, {
        headers: {
            Authorization: config.server.authorization
        }
    })
    if (res.data.status !== "success") throw new Error(res.data.message)
    options.path = options.path === undefined ? "" : options.path
    console.log("Directory listing of: "+ "./".yellow + options.path?.yellow)
    console.table(res.data.files)
}