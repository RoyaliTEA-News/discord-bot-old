import "dotenv/config";

import commandManager from "./start/interactionManager";

(async () => {
  await commandManager();
  import("./start/bot");
})();
