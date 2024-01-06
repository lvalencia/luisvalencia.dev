import { assert, createStubInstance, stub, restore, match } from "sinon";
import type { SinonStubbedInstance } from "sinon";
import { FileSelector, NonUploadedFilesSelector } from "@/src/fileSelector";
import { CodeDeployer } from "@/src/codeDeployer";
import { PollingStrategy } from "@/src/poller";
import {
  FileUploader,
  Uploader,
  UploadResultError,
  UploadResultSuccess,
} from "@/src/fileUploader";
import { Credentials } from "aws-sdk";
import { SupportedRegions } from "@/src/config";
import { ValidFilePath } from "@luvle/utils/dist";
import { Logger } from "@/src/logger";
import { prettyJSON } from "@/src/helpers";
import { CacheInvalidator, Invalidator } from "@/src/cacheInvalidator";

describe("CodeDeployer", () => {
  const credentials = {} as Credentials;
  const region = "us-east-1" as SupportedRegions;
  const sourceFolder = "sourceFolder" as ValidFilePath;
  const invalidationPollingStrategy = PollingStrategy.NoPolling;
  const configuration = {
    credentials,
    region,
    sourceFolder,
    invalidationPollingStrategy,
  };

  describe("#deploy", () => {
    const mockValidFilePaths = ["valid"] as ValidFilePath[];
    const noOpFunction = () => {};
    const asyncNoOpFunction = async () => {};
    const mockS3BucketLocation = "mockS3BucketLocation";
    const mockUploadResultErrorData = {
      name: "name",
      message: "message",
      stack: "stack",
    };
    const mockUploadResultSuccess: UploadResultSuccess = {
      status: "Success",
      data: {
        Location: mockS3BucketLocation,
        ETag: "",
        Bucket: "",
        Key: "",
      },
    };
    const mockUploadResultError: UploadResultError = {
      status: "Error",
      data: mockUploadResultErrorData,
    };

    let fileSelectorStub: SinonStubbedInstance<FileSelector>;
    let loggerStub: SinonStubbedInstance<Logger>;
    let fileUploaderStub: SinonStubbedInstance<Uploader>;
    let cacheInvalidatorStub: SinonStubbedInstance<Invalidator>;

    beforeEach(async () => {
      // Setup
      fileSelectorStub = createStubInstance(NonUploadedFilesSelector);
      fileSelectorStub.selectFiles.returns(Promise.resolve(mockValidFilePaths));

      loggerStub = stub<Logger>(console);
      loggerStub.log.callsFake(noOpFunction);

      fileUploaderStub = createStubInstance(FileUploader);
      fileUploaderStub.upload.returns(
        Promise.resolve([
          mockUploadResultSuccess,
          mockUploadResultSuccess,
          mockUploadResultError,
          mockUploadResultError,
        ])
      );

      cacheInvalidatorStub = createStubInstance(CacheInvalidator);
      cacheInvalidatorStub.invalidate.callsFake(asyncNoOpFunction);

      // Instantiation and Invocation
      const deployer = new CodeDeployer({
        configuration,
        fileSelector: fileSelectorStub,
        logger: loggerStub,
        uploader: fileUploaderStub,
        invalidator: cacheInvalidatorStub,
      });

      await deployer.deploy();
    });

    afterEach(() => {
      restore();
    });

    it("selects the files to upload", async () => {
      assert.calledOnce(fileSelectorStub.selectFiles);
    });

    it("states which files it will upload", async () => {
      assert.calledWithMatch(
        loggerStub.log,
        match(`${prettyJSON(mockValidFilePaths)}`)
      );
    });

    it("uploads the files", async () => {
      assert.calledOnceWithExactly(
        fileUploaderStub.upload,
        mockValidFilePaths,
        sourceFolder
      );
    });

    it("states how many and which files succeeded in uploading", async () => {
      assert.calledWithMatch(
        loggerStub.log,
        match(
          `Successfullly uploaded 2 files: ${prettyJSON([
            mockS3BucketLocation,
            mockS3BucketLocation,
          ])}`
        )
      );
    });

    it("states how many and which files failed in uploading", async () => {
      assert.calledWithMatch(
        loggerStub.log,
        match(
          `Failed to upload 2 files: ${prettyJSON([
            mockUploadResultErrorData,
            mockUploadResultErrorData,
          ])}`
        )
      );
    });

    it("perfoms any necesary invalidations", async () => {
      assert.calledOnce(cacheInvalidatorStub.invalidate);
    });

    it("states the upload has finished", async () => {
      assert.calledWithMatch(
        loggerStub.log,
        match(`complete`)
      );
    });
  });
});
