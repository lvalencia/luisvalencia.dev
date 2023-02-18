import { SharedIniFileCredentials, Credentials } from "aws-sdk";
import { cwd } from "process";
import { join } from "path";
import {
  fromMaybe,
  isSomething,
  Maybe,
  isValidFilePath,
  ValidFilePath,
} from "@luvle/utils";
import { PollingStrategy } from "../poller";

export type SupportedRegions = "us-east-1";

export interface DeploymentConfiguration {
  credentials: Credentials;
  region: SupportedRegions;
  sourceFolder: ValidFilePath;
  invalidationPollingStrategy: PollingStrategy;
}

interface DeploymentConfigArgs {
  environmentConfiguration: any;
}

const DEFAULT_AWS_PROFILE = "luisvalencia.dev";
const DEFAULT_AWS_REGION: SupportedRegions = "us-east-1";
const DEFAULT_DISTRIBUTION_DIRECTORY = join(cwd(), "..", "luvle-site", "dist");

export class DeploymentConfig {
  private readonly awsProfile: string;
  private readonly awsRegion: SupportedRegions;
  private readonly distributionDirectory: ValidFilePath;
  private readonly pollingStrategy: PollingStrategy;
  private awsCredentials: Maybe<Credentials>;

  constructor(args: DeploymentConfigArgs) {
    const {
      AWS_PROFILE: awsProfile,
      AWS_REGION: awsRegion,
      DISTRIBUTION_DIRECTORY: distributionDirectory,
      POLL: poll,
    } = args.environmentConfiguration;

    this.awsProfile = fromMaybe({
      maybe: awsProfile,
      fallback: DEFAULT_AWS_PROFILE,
    });

    this.awsRegion = fromMaybe({
      maybe: awsRegion,
      fallback: DEFAULT_AWS_REGION,
    });

    const shouldPoll = fromMaybe({
      maybe: poll,
      fallback: false,
    });

    this.pollingStrategy = shouldPoll
      ? PollingStrategy.PollingWithTimeout
      : PollingStrategy.NoPolling;

    const distributionPath = fromMaybe({
      maybe: distributionDirectory,
      fallback: DEFAULT_DISTRIBUTION_DIRECTORY,
    });

    if (!isValidFilePath(distributionPath)) {
      throw `code distribution path is not a valid directory: ${distributionDirectory}`;
    }

    this.distributionDirectory = distributionPath;
  }

  public config(): DeploymentConfiguration {
    return {
      credentials: this.credentials(),
      region: this.region(),
      sourceFolder: this.sourceFolder(),
      invalidationPollingStrategy: this.invalidationPollingStrategy(),
    };
  }

  private credentials(): Credentials {
    if (!isSomething(this.awsCredentials)) {
      this.awsCredentials = this.createAwsCredentials();
    }
    return this.awsCredentials as Credentials;
  }

  private region(): SupportedRegions {
    return this.awsRegion;
  }

  private createAwsCredentials(): Credentials {
    return new SharedIniFileCredentials({
      profile: this.awsProfile,
    });
  }

  private sourceFolder(): ValidFilePath {
    return this.distributionDirectory;
  }

  private invalidationPollingStrategy(): PollingStrategy {
    return this.pollingStrategy;
  }
}
