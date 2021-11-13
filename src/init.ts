import "dotenv/config";

import commandManager from "./start/interactionManager";
import radioManager from "./start/radioManager";

(async () => {
  await commandManager();
  await radioManager();
  import("./start/bot");
})();
