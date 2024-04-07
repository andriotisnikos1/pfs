import { FilesConfig } from "../types/interfaces/Config";
import fsp from "fs/promises"
import os from "os"

export default async (cfg: FilesConfig): Promise<void> => {
    await fsp.writeFile(`${os.homedir()}/.pfs/config.json`, JSON.stringify(cfg))
}