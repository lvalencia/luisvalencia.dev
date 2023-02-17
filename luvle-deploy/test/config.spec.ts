import { Config } from "@/src/config";
import { expect } from 'chai';
import { cwd } from "process";
import { join } from "path";
import { PollingStrategy } from "@/src/poller";

describe("Config", () => {
  describe("#config", () => {
    it("returns the default values", () => {
      const { 
        credentials,
        region,
        sourceFolder,
        invalidationPollingStrategy
      } = new Config({
        environmentConfiguration: {}
      }).config();

      expect(region).to.equal("us-east-1");
      expect(sourceFolder).to.equal(join(cwd(), "..", "luvle-site", "dist"));
      expect(invalidationPollingStrategy).to.equal(PollingStrategy.NoPolling);
    });

    it("returns the overriden values", () => {
      const awsProfile = "test-profile";
      const awsRegion = "us-west-2";
      const distributionDirectory = "./";

      const environmentConfiguration = {
        AWS_PROFILE: awsProfile,
        AWS_REGION: awsRegion,
        DISTRIBUTION_DIRECTORY: distributionDirectory,
        POLL: true
      };

      const { 
        credentials,
        region,
        sourceFolder,
        invalidationPollingStrategy
      } = new Config({
        environmentConfiguration,
      }).config();
      
      expect(region).to.equal(awsRegion);
      expect(sourceFolder).to.equal(distributionDirectory);
      expect(invalidationPollingStrategy).to.equal(PollingStrategy.PollingWithTimeout);
    });
  });
});