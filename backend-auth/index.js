const app = require("./app");
const http = require("http");
const config = require("./config");
const logger = require("./utils/logger");

const server = http.createServer(app);

// const PORT = config.PORT || 4000; 
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
