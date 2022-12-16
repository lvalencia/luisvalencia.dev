import { Credentials } from 'aws-sdk';
import { ValidFilePath } from './utils';

export type SupportedRegions = 'us-east-1';

export interface DeploymentConfiguration {
    credentials: Credentials;
    region: SupportedRegions;
    sourceFolder: ValidFilePath;
}
