import * as dotenv from "dotenv";

import { openWallet } from "utils";
import { readdir } from "fs/promises";

dotenv.config();

async function init() {
  const wallet = await openWallet(process.env.MNEMONIC!.split(" "), true);
  
}

void init();