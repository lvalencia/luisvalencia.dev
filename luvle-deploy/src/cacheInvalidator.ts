import { CloudFront } from "aws-sdk";
import { DeploymentConfiguration } from "./config/deployment";
import { DefaultLogger, Logger } from "./logger";
import { Poller, PollingStrategy } from "./poller";
import { PollerFactory } from "./poller/factory";
import { fromMaybe, PromiseCallback, Time } from "@luvle/utils";
import { prettyJSON } from "./helpers";

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
const CLOUDFRONT_P99_INVALIDATION_WAIT_TIME = new Time({
  seconds: 100,
});

interface CreateInvalidationSuccess {
  status: "Success";
  data: CreateInvalidationResultData;
}

interface CreateInvlidationError {
  status: "Error";
  data: Error;
}

type CreateInvalidationResult =
  | CreateInvalidationSuccess
  | CreateInvlidationError;

interface GetInvalidationSuccess {
  status: "Success";
  data: GetInvalidationResultData;
}

interface GetInvalidationError {
  status: "Error";
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
      configuration: { credentials, region, invalidationPollingStrategy },
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
      fallback: this.fallbackPoller(invalidationPollingStrategy),
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

    if (invalidationResult.status === "Success") {
      const invalidation = invalidationResult.data.Invalidation!;
      this.logger.log(`${prettyJSON(invalidation)}`);

      const { Id: id } = invalidation;

      await this.poller.poll(this.getInvalidation(id, distributionId));
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
              status: "Error",
              data: error,
            });
          }
          if (data) {
            this.logger.info(`Invalidation success: ${data.Location}`);
            resolve({
              status: "Success",
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
              status: "Error",
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
              status: "Success",
              data,
            });
          }
        }
      );
    };
  }

  private fallbackPoller(pollingStrategy: PollingStrategy): Poller {
    const StrategyToPollerArgsMapping: Record<PollingStrategy, any> = {
      [PollingStrategy.NoPolling]: undefined,
      [PollingStrategy.PollingWithTimeout]: {
        logger: this.logger,
        interval: new Time({
          seconds: 10,
        }),
        timeout: CLOUDFRONT_P99_INVALIDATION_WAIT_TIME,
      },
    };
    return PollerFactory.create(
      pollingStrategy,
      StrategyToPollerArgsMapping[pollingStrategy]
    );
  }

  private get callReference() {
    return `${new Date().toISOString()}-${this.constructor.name}`;
  }
}
