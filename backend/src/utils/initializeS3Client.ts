import { S3Client } from "@aws-sdk/client-s3";

import { FILES } from "@config";

export const initializeS3Client = () => {
  const { S3 } = FILES;

  try {
    const client = new S3Client({
      // @NOTE - endpoint + forcePathStyle are required for localstack
      region: "eu-central-1",
      endpoint: `https://${S3.endpoint}`,
      credentials: {
        accessKeyId: S3.accessKeyId,
        secretAccessKey: S3.secretAccessKey,
      },
      forcePathStyle: true,
    });

    return client;
  } catch (error) {
    log.error({
      error,
      message: `Failed to initialize S3 client!!`,
    });
  }
};
