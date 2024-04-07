import { Router } from "express";
import init from "./init";
import remove from "./remove";

const auth = Router();

auth.get("/init", init);
auth.delete("/remove", remove);

export default auth;