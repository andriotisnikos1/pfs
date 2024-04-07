import { Command } from "commander";
import axios from "axios";
import { config, serverURL } from "../../../central.config.js";
import { spinner } from "@clack/prompts";

const command_filesDelete = new Command("delete");

command_filesDelete
  .description("Delete a file")
  .argument("<path>", "File to delete")
  .action(action);


async function action(file:string) {
  const s = spinner()
  s.start("Deleting file")
  // Send request to server
  const res = await axios.post<{
      status: "success" | "error",
      message?: string,
  }>(serverURL + "/files/delete", {
      path: file
  }, {
    headers: {
      Authorization: config.server.authorization
    }
  })
  // output based on response
  if (res.data.status === "error") {
      s.stop("Unable to delete file", 1)
      return
  }
  s.stop("File deleted successfully!")
}

export default command_filesDelete;