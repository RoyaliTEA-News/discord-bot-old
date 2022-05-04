import { debug } from "../../../util/logger";

export = {
  name: "unhandledRejection",
  type: "process",
  execute(_client, e) {
    if (String(e?.stack || "").includes?.("Headers Timeout Error")) return;
    if (String(e?.stack || "").includes?.("Unknown interaction")) return;
    if (String(e?.stack || "").includes?.("Missing Access")) return;

    debug("unhandledRejection", e);
  }
} as ClientEvent;
