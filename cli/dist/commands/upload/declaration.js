import { Command } from "commander";
const upload = new Command("upload");
upload
    .description("Upload a file to PFS")
    .argument("<file>", "The file to upload")
    .option("-d, --destination <destination>", "The destination path");
