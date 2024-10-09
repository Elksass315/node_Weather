import express from "express";
import config from "config";
import routesStartup from "./startup/routes.js";
import DB_Startup from "./startup/DB.js";
import loggingStartup from "./startup/logging.js";
const app = express();

routesStartup(app);
DB_Startup();
loggingStartup();

const PORT = config.get("port") || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});