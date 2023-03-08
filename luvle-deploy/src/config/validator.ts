import { fromMaybe } from "@luvle/utils/dist";
import { stringIsSomething } from "@luvle/utils/dist";
import { Credentials } from "aws-sdk";
import { DeploymentConfiguration } from "./deployment";

export enum DeploymentConfigValidationResultStatus {
  Valid = "Valid",
  Invalid = "Invalid"
}

interface DeploymentConfigValidationResultInvalid {
  status: DeploymentConfigValidationResultStatus.Invalid;
  data: string[];
}

interface DeploymentConfigValidationResultValid {
  status: DeploymentConfigValidationResultStatus.Valid;
  data: string[];
}

type DeploymentConfigValidationResult = DeploymentConfigValidationResultValid | DeploymentConfigValidationResultInvalid;

interface DeploymentConfigValidaatorArgs {
  configuration: DeploymentConfiguration
}

export class DeploymentConfigValidator {
  private readonly config: Credentials;
  constructor(args: DeploymentConfigValidaatorArgs) {
    const {
      configuration: {
        credentials,
      }
    } = args;

    this.config = fromMaybe({
      maybe: credentials,
      fallback: {} as Credentials
    });
  }

  public validate(): DeploymentConfigValidationResult {
    const {
      accessKeyId,
      secretAccessKey,
    } = this.config;

    const errors = [];
    if(!stringIsSomething(accessKeyId)) {
      errors.push("Could not find aws_access_key_id in ~/.aws/credentials");
    }

    if(!stringIsSomething(secretAccessKey)) {
      errors.push("Could not find aws_secret_access_key in ~/.aws/credentials");
    }
    
    const hadErrors = errors.length !== 0;
    return {
      status: this.validationStatus(hadErrors),
      data: errors
    }
  }

  private validationStatus(hadErrors: boolean): DeploymentConfigValidationResultStatus {
    return hadErrors ? DeploymentConfigValidationResultStatus.Invalid : DeploymentConfigValidationResultStatus.Valid;
    
  }
}