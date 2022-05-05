import "dotenv/config";

import { exec } from "child_process";
import dl from "download-git-repo";
import { writeFileSync } from "fs";

import { updateInteractions } from "./interactions";
import { debug, info } from "./util/logger";

exec("yarn outdated", async (err, stdout) => {
  if (!err) info("There are no outdated packages.");
  else {
    info(`There is ${stdout.split("\n").slice(6).length} outdated packages. (${stdout
      .split("\n")
      .filter(x => x !== "")
      .slice(5)
      .map(x => x.split(" ")[0])
      .join(", ")
      })`);

    const packages = require("../package.json");

    stdout.split("\n").slice(5).map(y => {
      const x = y.split(" ").filter(x => x !== "" && x !== " ");

      if (!x[0]) return;

      debug(`Updated ${x[0]}, restart to apply. (${x[1]} -> ${x[3]})`);

      packages[x[4]][x[0]] = `^${x[3]}`;

      writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(packages, null, 2));
    });
  }


  setInterval(download, 60000 * 10);
  download();

  function download() {
    exec("yarn removeRadios", () => {
      dl("direct:https://github.com/RoyaliTEA-News/radios", `${process.cwd()}/radios/`, { clone: true }, () => { return });
    })
  }

  await updateInteractions();

  import("./bot");
});
