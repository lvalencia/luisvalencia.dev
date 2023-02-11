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
import { PollingStrategy } from "./poller";

export type SupportedRegions = "us-east-1";

export interface DeploymentConfiguration {
  credentials: Credentials;
  region: SupportedRegions;
  sourceFolder: ValidFilePath;
  invalidationPollingStrategy: PollingStrategy;
}

interface ConfigArgs {
  environmentConfiguration: any;
}

const DEFAULT_AWS_PROFILE = "luisvalencia.dev";
const DEFAULT_AWS_REGION: SupportedRegions = "us-east-1";
const DEFAULT_DISTRIBUTION_DIRECTORY = join(cwd(), "..", "luvle-site", "dist");

export class Config {
  private readonly awsProfile: string;
  private readonly awsRegion: SupportedRegions;
  private readonly distributionDirectory: ValidFilePath;
  private awsCredentials: Maybe<Credentials>;

  constructor(args: ConfigArgs) {
    const {
      AWS_PROFILE: awsProfile,
      AWS_REGION: awsRegion,
      DISTRIBUTION_DIRECTORY: distributionDirectory,
    } = args.environmentConfiguration;

    this.awsProfile = fromMaybe({
      maybe: awsProfile,
      fallback: DEFAULT_AWS_PROFILE,
    });

    this.awsRegion = fromMaybe({
      maybe: awsRegion,
      fallback: DEFAULT_AWS_REGION,
    });

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
    return process.env.POLL
      ? PollingStrategy.PollingWithTimeout
      : PollingStrategy.NoPolling;
  }
}
