import { Formatter } from '@/src/formatter';
import { DeploymentLogger, Logger, LoggerOperation } from '@/src/logger';
import { assert, stub, mock, restore } from 'sinon';
import type { SinonStubbedInstance, SinonMock } from 'sinon';
import { identity, without } from 'underscore';

const {
  calledWith,
  notCalled
} = assert;

describe("DeploymentLogger", () => {
  const data = "data"
  const formatter: Formatter = {
    format: identity
  };
  let logger: SinonStubbedInstance<Logger>;
  let mockFormatter: SinonMock;
  let deploymentLogger: DeploymentLogger;

  beforeEach(() => {
    logger = stub<Logger>(console);
    mockFormatter = mock(formatter);
    deploymentLogger = new DeploymentLogger({
      logger,
      formatter
    });
  });

  afterEach(() => {
    restore();
  });

  const operations: LoggerOperation[] = [
    "debug",
    "info",
    "log",
    "warn",
    "error",
  ];

  operations.forEach((operation: LoggerOperation) => {
    describe(`#${operation}`,() => {
      it("calls the formatter with the expected value", () => {
        mockFormatter.expects("format").withArgs(data);
  
        deploymentLogger[operation](data);
  
        mockFormatter.verify();
      });
      it(`calls only the ${operation} function in the logger`, () => {
        deploymentLogger[operation](data);  

        calledWith(logger[operation], data);

        without(operations, operation).forEach((otherOperation) => {
          notCalled(logger[otherOperation as LoggerOperation]);
        });
      });
    });
  })
});
