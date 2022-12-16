import { threadId } from "worker_threads";
import { DirectoryReader, FileSystemReader } from "./directoryReader";
import { FileUploader, Uploader } from "./fileUploader";
import { DefaultLogger, Logger } from "./logger";
import { DeploymentConfiguration } from "./shared";
import { fromMaybe, groupBy, prettyJSON, ValidFilePath } from "./utils";

interface CodeDeployerArgs {
    configuration: DeploymentConfiguration,
    logger?: Logger;
    uploader?: Uploader;
    directoryReader?: FileSystemReader;
}

export class CodeDeployer {
    private readonly sourceFolder: ValidFilePath;
    private readonly directoryReader: FileSystemReader;
    private readonly uploader: Uploader;
    private readonly logger: Logger;

    constructor(args: CodeDeployerArgs) {
        const {
            uploader,
            directoryReader,
            configuration: {
                credentials,
                region,
                sourceFolder
            },
            logger
        } = args;

        this.sourceFolder = sourceFolder;

        this.logger = fromMaybe<Logger>({
            maybe: logger,
            fallback: DefaultLogger
        });

        this.directoryReader = fromMaybe<FileSystemReader>({
            maybe: directoryReader,
            fallback: new DirectoryReader()
        });

        this.uploader = fromMaybe<Uploader>({
            maybe: uploader,
            fallback: new FileUploader({
                credentials,
                region,
                logger
            })
        });
    }
    
    public async deploy(): Promise<void> {
        const filesToUpload = this.directoryReader.read(this.sourceFolder);
        this.logger.log(`Uploading the following files: ${prettyJSON(filesToUpload)}`);

        let results = await this.uploader.upload(filesToUpload, this.sourceFolder);
        results = groupBy(results, 'status');

        const successes = fromMaybe({
            maybe: results['SUCCESS'],
            fallback: []
        });
        this.logger.log(`Successfullly uploaded ${successes.length} files: ${prettyJSON(successes.map((success) => success.data.Location))}`);

        const failures = fromMaybe({
            maybe: results['ERROR'],
            fallback: []
        });
        this.logger.log(`Failed to upload ${failures.length} files: ${prettyJSON(failures.map((failure) => failure.data))}`);
    }
}
