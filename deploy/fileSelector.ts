import { S3, Credentials } from "aws-sdk";
import { join } from "path";
import { SupportedRegions } from "./config";
import { DirectoryReader, FileSystemReader } from "./directoryReader";
import { DefaultLogger, Logger } from "./logger";
import { fromMaybe, isValidFilePath, ValidFilePath } from "./utils";
import { difference } from "./utils/array";

type ListObjectParams = S3.Types.ListObjectsRequest;
type ListObjectsResultData = S3.Types.ListObjectsOutput;

interface StorageClient {
  listObjects(
    paras: ListObjectParams,
    callback?: (error: Error, data: ListObjectsResultData) => void
  ): unknown;
}

type StorageClientOptions = S3.Types.ClientConfiguration;

interface StorageClientConstructor {
  new (options?: StorageClientOptions): StorageClient;
}

type SupportedClientAPIs = "2006-03-01";

export interface ListObjectsResultSuccess {
  status: "SUCCESS";
  data: ListObjectsResultData;
}
export interface ListObjectsResultError {
  status: "ERROR";
  data: Error;
}

type ListObjectsResult = ListObjectsResultSuccess | ListObjectsResultError;

interface FileSelectorArgs {
  credentials: Credentials;
  region: SupportedRegions;
  sourceFolder: ValidFilePath;
  storageClientConstructor?: StorageClientConstructor;
  storageTarget?: string;
  storageClientVersion?: SupportedClientAPIs;
  logger?: Logger;
  directoryReader?: FileSystemReader;
}

export interface FileSelector {
  selectFiles(): Promise<ValidFilePath[]>;
}

const AWS_S3_CLIENT = S3;
const DEAFULT_AWS_S3_API_VERSION: SupportedClientAPIs = "2006-03-01";
const DEFAULT_AWS_S3_BUCKET: string = "luisvalencia.dev";

export class NonUploadedFilesSelector implements FileSelector {
  private readonly client: StorageClient;
  private readonly storageTarget: string;
  private readonly sourceFolder: ValidFilePath;
  private readonly directoryReader: FileSystemReader;
  private readonly logger: Logger;

  constructor(args: FileSelectorArgs) {
    const {
      credentials,
      region,
      storageClientConstructor,
      storageClientVersion,
      storageTarget,
      logger,
      sourceFolder,
      directoryReader,
    } = args;

    this.logger = fromMaybe({
      maybe: logger,
      fallback: DefaultLogger,
    });

    this.sourceFolder = sourceFolder;

    this.directoryReader = fromMaybe({
      maybe: directoryReader,
      fallback: new DirectoryReader(),
    });

    this.storageTarget = fromMaybe({
      maybe: storageTarget,
      fallback: DEFAULT_AWS_S3_BUCKET,
    });

    const apiVersion = fromMaybe({
      maybe: storageClientVersion,
      fallback: DEAFULT_AWS_S3_API_VERSION,
    });

    const clientConstructor = fromMaybe({
      maybe: storageClientConstructor,
      fallback: AWS_S3_CLIENT,
    });

    this.client = new clientConstructor({
      apiVersion,
      credentials,
      region,
    });
  }

  public async selectFiles(): Promise<ValidFilePath[]> {
    let result = await this.queryUploadedFiles();

    if (result.status === "ERROR") {
      this.logger.log(`Failed to list objects ${result.data}`);
      result = {
        status: "SUCCESS",
        data: {
          Contents: [],
        },
      } as ListObjectsResultSuccess;
    }

    const listedObjects = fromMaybe<S3.Object[]>({
      maybe: result.data.Contents,
      fallback: [],
    });

    const uploadedFiles = listedObjects
      .map((object) => {
        return join(this.sourceFolder, object.Key!);
      })
      .filter(isValidFilePath);

    const filesToDeploy = this.directoryReader.read(this.sourceFolder);

    const requiredFiles = ["index.html"]
      .map((file) => {
        return join(this.sourceFolder, file);
      })
      .filter(isValidFilePath);

    return difference(filesToDeploy, uploadedFiles).concat(requiredFiles);
  }

  private queryUploadedFiles(): Promise<ListObjectsResult> {
    return new Promise((resolve) => {
      this.client.listObjects(
        {
          Bucket: this.storageTarget,
        },
        (error, data) => {
          if (error) {
            this.logger.error(`ListObjects error: ${error}`);
            resolve({
              status: "ERROR",
              data: error,
            });
          }
          if (data) {
            this.logger.info(
              `ListObjects success: Found ${data.Contents?.length} Objects`
            );
            resolve({
              status: "SUCCESS",
              data,
            });
          }
        }
      );
    });
  }
}
