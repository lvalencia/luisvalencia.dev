import { CacheInvalidator, Invalidator } from "./CacheInvalidator";
import { DeploymentConfiguration } from "./config";
import { DirectoryReader, FileSystemReader } from "./directoryReader";
import { FileSelector, NonUploadedFilesSelector } from "./fileSelector";
import {
  FileUploader,
  Uploader,
  UploadResultError,
  UploadResultSuccess,
} from "./fileUploader";
import { DefaultLogger, Logger } from "./logger";
import { fromMaybe, groupBy, prettyJSON, ValidFilePath } from "./utils";

interface CodeDeployerArgs {
  configuration: DeploymentConfiguration;
  logger?: Logger;
  fileSelector?: FileSelector;
  uploader?: Uploader;
  invalidator?: Invalidator;
  directoryReader?: FileSystemReader;
}

export class CodeDeployer {
  private readonly sourceFolder: ValidFilePath;
  private readonly fileSelector: FileSelector;
  private readonly uploader: Uploader;
  private readonly invalidator: Invalidator;
  private readonly logger: Logger;

  constructor(args: CodeDeployerArgs) {
    const {
      fileSelector,
      uploader,
      invalidator,
      directoryReader,
      configuration: { credentials, region, sourceFolder },
      logger,
    } = args;

    this.sourceFolder = sourceFolder;

    this.logger = fromMaybe({
      maybe: logger,
      fallback: DefaultLogger,
    });

    const fileDirectoryReader = fromMaybe({
      maybe: directoryReader,
      fallback: new DirectoryReader(),
    });

    this.fileSelector = fromMaybe({
      maybe: fileSelector,
      fallback: new NonUploadedFilesSelector({
        credentials,
        region,
        logger,
        sourceFolder,
        directoryReader: fileDirectoryReader,
      }),
    });

    this.uploader = fromMaybe({
      maybe: uploader,
      fallback: new FileUploader({
        credentials,
        region,
        logger,
      }),
    });

    this.invalidator = fromMaybe({
      maybe: invalidator,
      fallback: new CacheInvalidator({
        configuration: {
          credentials,
          region,
        },
        logger,
      }),
    });
  }

  public async deploy(): Promise<void> {
    const filesToUpload = await this.fileSelector.selectFiles();

    this.logger.log(
      `Uploading the following files: ${prettyJSON(filesToUpload)}`
    );

    let results = await this.uploader.upload(filesToUpload, this.sourceFolder);
    results = groupBy(results, "status");

    const successes = fromMaybe<UploadResultSuccess[]>({
      maybe: results["SUCCESS"],
      fallback: [],
    });
    this.logger.log(
      `Successfullly uploaded ${successes.length} files: ${prettyJSON(
        successes.map((success) => success.data.Location)
      )}`
    );

    const failures = fromMaybe<UploadResultError[]>({
      maybe: results["ERROR"],
      fallback: [],
    });
    this.logger.log(
      `Failed to upload ${failures.length} files: ${prettyJSON(
        failures.map((failure) => failure.data)
      )}`
    );

    await this.invalidator.invalidate();

    this.logger.log("Deployment complete.");
  }
}
