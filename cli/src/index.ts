#!/usr/bin/env node
import { program } from "commander";
import cp from 'child_process';

program
  .version('0.0.1')
  .action(() => {
    const child = cp.exec("npx pfs --version", (err, stdout, stderr) => {
      if (err) {
        console.error("[PFS Error]: Unable to check version");
        return;
      }
      const version = stdout.trim();
      // todo: check npm for new version
    })});
  
export const serverURL = 


program.parse(process.argv);