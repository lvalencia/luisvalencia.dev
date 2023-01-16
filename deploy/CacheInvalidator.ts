import { CloudFront } from "aws-sdk";
import { DeploymentConfiguration } from "./config";
import { DefaultLogger, Logger } from "./logger";
import { IntervalPoller, Poller } from "./poller";
import { fromMaybe, prettyJSON, PromiseCallback, Time } from "./utils";

type CacheConfiguration = Omit<DeploymentConfiguration, "sourceFolder">;

type CacheClientOptions = CloudFront.Types.ClientConfiguration;
type CreateInvalidationParams = CloudFront.Types.CreateInvalidationRequest;
type CreateInvalidationResultData = CloudFront.Types.CreateInvalidationResult;

type GetInvalidationParams = CloudFront.Types.GetInvalidationRequest;
type GetInvalidationResultData = CloudFront.Types.GetInvalidationResult;

interface CacheClient {
  createInvalidation(
    params: CreateInvalidationParams,
    callback?: (err: Error, data: CreateInvalidationResultData) => void
  ): unknown;

  getInvalidation(
    params: GetInvalidationParams,
    callback?: (error: Error, data: GetInvalidationResultData) => void
  ): unknown;
}

interface CacheClientConstructor {
  new (options?: CacheClientOptions): CacheClient;
}

interface CacheInvalidatorArgs {
  configuration: CacheConfiguration;
  poller?: Poller;
  cacheClientConstructor?: CacheClientConstructor;
  cacheClientVersion?: SupportedClientAPIs;
  logger?: Logger;
}

type SupportedClientAPIs = "2020-05-31";
const DEFAULT_CLOUDFRONT_API_VERSION: SupportedClientAPIs = "2020-05-31";
const DEFAULT_DISTRIBUTION_ID: string = "E1WGW8BYIPS2K1";

interface CreateInvalidationSuccess {
  status: "SUCCESS";
  data: CreateInvalidationResultData;
}

interface CreateInvlidationError {
  status: "ERROR";
  data: Error;
}

type CreateInvalidationResult =
  | CreateInvalidationSuccess
  | CreateInvlidationError;

interface GetInvalidationSuccess {
  status: "SUCCESS";
  data: GetInvalidationResultData;
}

interface GetInvalidationError {
  status: "ERROR";
  data: Error;
}

type GetInvalidationResult = GetInvalidationSuccess | GetInvalidationError;

interface InvalidateArgs {
  distributionId?: string;
  paths?: string[];
}

export interface Invalidator {
  invalidate(args?: InvalidateArgs): Promise<void>;
}

export class CacheInvalidator implements Invalidator {
  private readonly poller: Poller;
  private readonly client: CacheClient;
  private readonly logger: Logger;
  constructor(args: CacheInvalidatorArgs) {
    const {
      configuration: { credentials, region },
      poller,
      cacheClientConstructor,
      cacheClientVersion,
      logger,
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
      fallback: CloudFront,
    });

    this.client = new clientConstructor({
      apiVersion,
      credentials,
      region,
    });

    this.poller = fromMaybe({
      maybe: poller,
      fallback: new IntervalPoller({
        logger: this.logger,
        interval: new Time({
          seconds: 6,
        }),
        timeout: new Time({
          seconds: 60,
        }),
      }),
    });
  }

  public async invalidate(args?: InvalidateArgs): Promise<void> {
    const { paths: maybePaths, distributionId: maybeDistributionId } =
      args || {};

    const distributionId = fromMaybe({
      maybe: maybeDistributionId,
      fallback: DEFAULT_DISTRIBUTION_ID,
    });

    const paths = fromMaybe({
      maybe: maybePaths,
      fallback: ["/*"],
    });

    const invalidationResult = await this.invalidateCache(
      distributionId,
      paths
    );

    if (invalidationResult.status === "SUCCESS") {
      const invalidation = invalidationResult.data.Invalidation!;
      this.logger.log(`${prettyJSON(invalidation)}`);

      const { Id: id } = invalidation;

      this.logger.log(
        `Starting polling for "Completed" status for Validaition "${id}" in Distribution "${distributionId}"`
      );
      await this.poller.poll(this.getInvalidation(id, distributionId));
      this.logger.log("Polling complete.");
    }
  }

  private async invalidateCache(
    distributionId: string,
    paths: string[]
  ): Promise<CreateInvalidationResult> {
    return new Promise((resolve) => {
      this.client.createInvalidation(
        {
          DistributionId: distributionId,
          InvalidationBatch: {
            CallerReference: this.callReference,
            Paths: {
              Quantity: paths.length,
              Items: paths,
            },
          },
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
      );
    });
  }

  private getInvalidation(
    id: string,
    distributionId: string
  ): PromiseCallback<GetInvalidationResult> {
    return (resolve) => {
      this.logger.log(
        `Getting Invalidation "${id}" for Distribution "${distributionId}"`
      );
      this.client.getInvalidation(
        {
          Id: id,
          DistributionId: distributionId,
        },
        (error, data) => {
          if (error) {
            this.logger.error(`GetInvlidation error: ${error}`);
            resolve({
              status: "ERROR",
              data: error,
            });
          }

          if (data) {
            this.logger.info(
              `GetInvalidation success: ${prettyJSON(data.Invalidation)}`
            );
          }

          if (data.Invalidation?.Status === "Completed") {
            this.logger.log("Invalidaiton Completed");
            resolve({
              status: "SUCCESS",
              data,
            });
          }
        }
      );
    };
  }

  private get callReference() {
    return `${new Date().toISOString()}-${this.constructor.name}`;
  }
}
