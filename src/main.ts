import { writeFile } from "node:fs/promises";
import { createPass } from "./createPass";

import "dotenv/config";

(async () => {
  const pass = await createPass();

  await writeFile("dist/out.pkpass", pass.getAsBuffer());
  await writeFile("dist/out.zip", pass.getAsBuffer());
})();
