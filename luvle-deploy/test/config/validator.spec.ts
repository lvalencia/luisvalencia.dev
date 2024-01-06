import { DeploymentConfiguration, DeploymentConfigValidationResultStatus, DeploymentConfigValidator } from "@/src/config";
import { Credentials } from "aws-sdk";
import { expect } from 'chai';

describe("DeploymentConfigValidtor", () => {
  const accessKeyId = "accessKeyId";
  const secretAccessKey = "secretAccessKey";

  describe("#validate", () => {
    it("returns invalid state", () => {
      let validator = new DeploymentConfigValidator({
        configuration: {} as DeploymentConfiguration
      });

      let validationResult = validator.validate();
      let status = validationResult.status;
      let errors = validationResult.data;

      expect(status).to.equal(DeploymentConfigValidationResultStatus.Invalid);
      expect(errors.length).to.equal(2);
      expect(errors[0]).to.match(/aws_access_key_id/);
      expect(errors[1]).to.match(/aws_secret_access_key/);

      validator = new DeploymentConfigValidator({
        configuration: {
          credentials: {
            accessKeyId,
          }
        } as DeploymentConfiguration
      });

      validationResult = validator.validate();
      status = validationResult.status;
      errors = validationResult.data;

      expect(status).to.equal(DeploymentConfigValidationResultStatus.Invalid);
      expect(errors.length).to.equal(1);
      expect(errors[0]).to.match(/aws_secret_access_key/);

      validator = new DeploymentConfigValidator({
        configuration: {
          credentials: {
            secretAccessKey,
          }
        } as DeploymentConfiguration
      });

      validationResult = validator.validate();
      status = validationResult.status;
      errors = validationResult.data;

      expect(status).to.equal(DeploymentConfigValidationResultStatus.Invalid);
      expect(errors.length).to.equal(1);
      expect(errors[0]).to.match(/aws_access_key_id/);
    });

    it("returns a valid state", () => {
      const validator = new DeploymentConfigValidator({
        configuration: {
          credentials: {
            accessKeyId,
            secretAccessKey
          } as Credentials
        } as DeploymentConfiguration
      });
  
      const {
        status,
        data 
      } = validator.validate();
  
      expect(status).to.equal(DeploymentConfigValidationResultStatus.Valid);
      expect(data.length).to.equal(0);
    });
  });
});