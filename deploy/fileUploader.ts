import { S3, Credentials } from 'aws-sdk';
import { createReadStream, PathLike, ReadStream } from 'fs';
import { DefaultLogger, Logger } from './logger';
import { fromMaybe, ValidFilePath } from './utils';
import { lookup } from 'mime-types';
import { SupportedRegions } from './config';

type UploadParams = S3.Types.PutObjectRequest;
type UploadResultData = S3.ManagedUpload.SendData;

interface UploadClient {
    upload(params: UploadParams, callback?: (err: Error, data: UploadResultData) => void): unknown; 
}
type UploadClientOptions = S3.Types.ClientConfiguration;

interface UploadClientConstructor {
    new (options?: UploadClientOptions): UploadClient
}

type SupportedClientAPIs = '2006-03-01';
type UploadTarget = string;
type FileReader = (path: PathLike) => ReadStream;

type ContentTypeResolverFunction = (path: string) => string;

interface FileUploaderArgs {
    credentials: Credentials;
    region: SupportedRegions;
    uploadClientConstructor?: UploadClientConstructor;
    uploadClientVersion?: SupportedClientAPIs;
    uploadTarget?: UploadTarget;
    fileReader?: FileReader
    logger?: Logger;
    resolveContentType?: ContentTypeResolverFunction;
}

interface UploadResultSuccess {
    status: "SUCCESS",
    data: UploadResultData
}
interface UploadResultError {
    status: "ERROR",
    data: Error
}

type UploadResult = UploadResultSuccess | UploadResultError;

export interface Uploader {
    upload(validFiles: ValidFilePath[], basePath: ValidFilePath): Promise<UploadResult[]>
}

const AWS_S3_CLIENT = S3;
const DEAFULT_AWS_S3_API_VERSION: SupportedClientAPIs = '2006-03-01';
const DEFAULT_AWS_S3_BUCKET: string = 'luisvalencia.dev';

export class FileUploader implements Uploader {
    private readonly client: UploadClient;
    private readonly uploadTarget: UploadTarget;
    private readonly fileReader: FileReader;
    private readonly resolveContentType: ContentTypeResolverFunction;
    private readonly logger: Logger;

    constructor(args: FileUploaderArgs) {
        const {
            uploadClientConstructor,
            uploadClientVersion,
            credentials,
            region,
            fileReader,
            uploadTarget,
            logger,
            resolveContentType,
        } = args;

        this.fileReader = fromMaybe({
            maybe: fileReader,
            fallback: createReadStream
        });

        this.resolveContentType = fromMaybe({
            maybe: resolveContentType,
            fallback: lookup
        });

        this.uploadTarget = fromMaybe({
            maybe: uploadTarget,
            fallback: DEFAULT_AWS_S3_BUCKET,
        });

        const apiVersion = fromMaybe({
            maybe: uploadClientVersion,
            fallback: DEAFULT_AWS_S3_API_VERSION
        });

        const clientConstructor = fromMaybe({
            maybe: uploadClientConstructor,
            fallback: AWS_S3_CLIENT
        })

        this.client = new clientConstructor({
            apiVersion,
            credentials,
            region
        });

        this.logger = fromMaybe<Logger>({
            maybe: logger,
            fallback: DefaultLogger
        });
    }

    public upload(validFiles: ValidFilePath[], basePath: ValidFilePath): Promise<UploadResult[]> {
        return Promise.all(
            validFiles.map((validFile) => {
                return this.uploadFile(validFile, basePath);
            })
        );
    }

    private uploadFile(file: ValidFilePath, basePath: ValidFilePath): Promise<UploadResult> {
        const contentType = this.resolveContentType(file);
        const fileStream = this.fileReader(file);
        const filePath = this.relativeFilePath(file, basePath);

        this.logger.log(`Uploading ${file} of Content Type ${contentType} to ${this.uploadTarget}/${filePath}`);

        return new Promise((resolve) => {
            this.client.upload({
                Bucket: this.uploadTarget,
                Key: filePath,
                Body: fileStream,
                ContentType: contentType,
            }, (error, data) => {
                if (error) {
                    this.logger.info(`Upload error: ${error}`);
                    resolve({
                        status: "ERROR",
                        data: error
                    });
                }
                if (data) {
                    this.logger.info(`Upload success: ${data.Location}`);
                    resolve({
                        status: "SUCCESS",
                        data
                    });
                }
            });
        });
    }
    private relativeFilePath(filePath: ValidFilePath, basePath: ValidFilePath): string {
        return filePath.replace(`${basePath}/`, '');
    }
}
