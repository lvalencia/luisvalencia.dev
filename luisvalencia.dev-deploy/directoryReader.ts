import { fromMaybe, isValidFilePath, ValidFilePath } from "./utils";
import { Dirent, readdirSync } from "fs";
import { join } from "path";

type ReadDirectoryFunction = (
  path: string,
  options: { encoding: BufferEncoding; withFileTypes: boolean } & any
) => Dirent[];

export interface FileSystemReader {
  read(
    filePath: ValidFilePath,
    options?: { recursively?: boolean }
  ): ValidFilePath[];
}

type CollectionOfFilePaths = Set<ValidFilePath>;

interface DirectoryReaderArgs {
  filePathsRead?: CollectionOfFilePaths;
  readDirectoryFunction?: ReadDirectoryFunction;
}

export class DirectoryReader implements FileSystemReader {
  private readDirectory: ReadDirectoryFunction;
  private filePathsRead: Set<ValidFilePath>;

  constructor(args?: DirectoryReaderArgs) {
    const { filePathsRead, readDirectoryFunction } = { ...args };

    this.readDirectory = fromMaybe<ReadDirectoryFunction>({
      maybe: readDirectoryFunction,
      fallback: readdirSync,
    });

    this.filePathsRead = fromMaybe({
      maybe: filePathsRead,
      fallback: new Set<ValidFilePath>(),
    });
  }
  public read(
    sourceFilePath: ValidFilePath,
    { recursively } = { recursively: true }
  ): ValidFilePath[] {
    this.clearReadFilePaths();
    this.performReadOperation(sourceFilePath, recursively);
    return this.filePaths();
  }

  private performReadOperation(
    sourceFilePath: ValidFilePath,
    recursively = false
  ): void {
    this.readDirectory(sourceFilePath, {
      encoding: "utf-8",
      withFileTypes: true,
    }).forEach((entry) => {
      const { name: fileName } = entry;
      const fileSource = join(sourceFilePath, fileName);

      if (!isValidFilePath(fileSource)) {
        throw `Invalid file source: ${fileSource}`;
      }

      const isDirectory = entry.isDirectory();
      const shouldMarkRead = !isDirectory;

      if (shouldMarkRead) {
        this.markFilePathRead(fileSource);
      }

      const shouldReadDirectory = recursively && isDirectory;
      if (shouldReadDirectory) {
        this.performReadOperation(fileSource, recursively);
      }
    });
  }

  private markFilePathRead(filePath: ValidFilePath): void {
    this.filePathsRead.add(filePath);
  }

  private clearReadFilePaths(): void {
    this.filePathsRead.clear();
  }

  private filePaths(): ValidFilePath[] {
    return Array.from(this.filePathsRead);
  }
}
