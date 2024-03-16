#!/usr/bin/env node
import "./central.config.js"
import { program } from "commander";
import "./global.declaration.js"

const version = "0.0.1";

program
  .version(version)

program.parse(process.argv);