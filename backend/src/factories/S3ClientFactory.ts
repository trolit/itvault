import { S3Client } from "@aws-sdk/client-s3";
import { IS3ClientFactory } from "types/factories/IS3ClientFactory";

import { FILES } from "@config";

export class S3ClientFactory implements IS3ClientFactory {
  create(): S3Client {
    const { S3 } = FILES;

    return new S3Client({
      // @NOTE - endpoint + forcePathStyle are required for localstack
      region: "eu-central-1",
      endpoint: S3.endpoint,
      credentials: {
        accessKeyId: S3.accessKeyId,
        secretAccessKey: S3.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }
}
