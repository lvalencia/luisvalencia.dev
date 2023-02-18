import { CodeDeployer } from "./codeDeployer";
import { DeploymentConfig, DeploymentConfigValidationResultStatus, DeploymentConfigValidator } from "./config";
import { DeploymentLogger } from "./logger";
import { prettyJSON } from "./helpers";
import { pick } from "underscore";

const logger = new DeploymentLogger();

logger.log("Starting Deployment");

const configuration = new DeploymentConfig({
  environmentConfiguration: process.env,
}).config();

const {
  status: configurationStatus,
  data
} = new DeploymentConfigValidator({
  configuration
}).validate();

if (configurationStatus === DeploymentConfigValidationResultStatus.Invalid) {
  const error = "Invalid Deployment Configuration";
  logger.error(`${error}: ${data.join(', ')}`);
  throw `Halting Deployment: ${error}`;
}

logger.log(
  `Deploying with configuration: ${prettyJSON(
    pick(configuration, "region", "sourceFolder", "invalidationPollingStrategy")
  )}`
);

new CodeDeployer({
  configuration,
  logger,
}).deploy();
