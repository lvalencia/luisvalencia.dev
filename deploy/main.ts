import { CodeDeployer } from "./codeDeployer";
import { Config } from "./config";
import { DeploymentLogger } from "./logger";
import { pick, prettyJSON } from "./utils";

const logger = new DeploymentLogger();

logger.log("Starting Deployment");

const configuration = new Config({
  environmentConfiguration: process.env,
}).config();

logger.log(
  `Deploying with configuration: ${prettyJSON(
    pick(configuration, "region", "sourceFolder", "invalidationPollingStrategy")
  )}`
);

new CodeDeployer({
  configuration,
  logger,
}).deploy();
