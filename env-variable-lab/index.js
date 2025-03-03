const app = require("./app");
const http = require("http");
const logger = require("./utils/logger");
const config = require("./config");

const server = http.createServer(app);

console.log("Database: ", config.MONGO_URI);
console.log("NODE_ENV: ", config.NODE_ENV);
console.log("PORT: ", config.PORT);

const PORT = config.PORT || 4000; 
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
