import logger from "debug";

logger.enable("\\[*\\]");

const error = logger("[ERROR]"),
  warn = logger("[WARN]"),
  info = logger("[INFO]"),
  debug = logger("[DEBUG]"),
  shard = logger("[SHARD]");

error.color = "1";
warn.color = "166";
info.color = "4";
debug.color = "8";
shard.color = "2";

export { error, warn, info, debug, shard };
