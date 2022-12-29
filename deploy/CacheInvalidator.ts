import { CloudFront } from "aws-sdk";
import { resolve } from "path";
import { DeploymentConfiguration } from "./config";
import { DefaultLogger, Logger } from "./logger";
import { fromMaybe, prettyJSON } from "./utils";

type CacheConfiguration = Omit<DeploymentConfiguration, "sourceFolder">;

type CacheClientOptions = CloudFront.Types.ClientConfiguration;
type CreateInvalidationParams = CloudFront.Types.CreateInvalidationRequest;
type CreateInvalidationResult = CloudFront.Types.CreateInvalidationResult;

interface CacheClient {
  createInvalidation(params: CreateInvalidationParams, callback?: (err: Error, data: CreateInvalidationResult) => void): unknown;
}

interface CacheClientConstructor {
  new(options?: CacheClientOptions): CacheClient;
}

interface CacheInvalidatorArgs {
  configuration: CacheConfiguration,
  cacheClientConstructor?: CacheClientConstructor;
  cacheClientVersion?: SupportedClientAPIs,
  logger?: Logger;
}

type SupportedClientAPIs = "2020-05-31";
const DEFAULT_CLOUDFRONT_API_VERSION: SupportedClientAPIs = "2020-05-31";
const DEFAULT_DISTRIBUTION_ID: string = "E1WGW8BYIPS2K1";

interface InvalidationSuccess {
  status: "SUCCESS";
  data: CreateInvalidationResult;
}

interface InvlidationError {
  status: "ERROR";
  data: Error;
}

type InvalidationResult = InvalidationSuccess | InvlidationError;

interface InvalidateArgs {
  distributionId?: string;
  paths?: string[];
}
export interface Invalidator {
  invalidate(args?: InvalidateArgs): Promise<void>;
}

export class CacheInvalidator implements Invalidator {
  private readonly client: CacheClient;
  private readonly logger: Logger;
  constructor(args: CacheInvalidatorArgs) {

    const {
      configuration: {
        credentials,
        region
      },
      cacheClientConstructor,
      cacheClientVersion,
      logger
    } = args;

    this.logger = fromMaybe<Logger>({
      maybe: logger,
      fallback: DefaultLogger,
    });

    const apiVersion = fromMaybe({
      maybe: cacheClientVersion,
      fallback: DEFAULT_CLOUDFRONT_API_VERSION,
    });

    const clientConstructor = fromMaybe({
      maybe: cacheClientConstructor,
      fallback: CloudFront
    });

    this.client = new clientConstructor({
      apiVersion,
      credentials,
      region,
    });
  }

  public async invalidate(args?: InvalidateArgs): Promise<void> {
    const {
      paths: maybePaths,
      distributionId: maybeDistributionId
    } = args || {};

    const distributionId = fromMaybe({
      maybe: maybeDistributionId,
      fallback: DEFAULT_DISTRIBUTION_ID
    });

    const paths = fromMaybe({
      maybe: maybePaths,
      fallback: [
        "/*"
      ]
    });

    const invalidationResult = await this.invalidateCache(distributionId, paths);
    if (invalidationResult.status === "SUCCESS") {
      this.logger.log(`${prettyJSON(invalidationResult.data.Invalidation)}`);
    }
  }

  private async invalidateCache(distributionId: string, paths: string[]): Promise<InvalidationResult> {
    return new Promise((resolve) => {
      this.client.createInvalidation({
        DistributionId: distributionId,
        InvalidationBatch: {
          CallerReference: this.callReference,
          Paths: {
            Quantity: paths.length,
            Items: paths,
          }
        }
      },
        (error, data) => {
          if (error) {
            this.logger.error(`Invlidation error: ${error}`);
            resolve({
              status: "ERROR",
              data: error,
            });
          }
          if (data) {
            this.logger.info(`Invalidation success: ${data.Location}`);
            resolve({
              status: "SUCCESS",
              data,
            });
          }
        }
      )
    });
  }

  private get callReference() {
      return `${new Date().toISOString()}-${this.constructor.name}`;
  }
}
