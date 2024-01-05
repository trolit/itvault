import { S3Client } from "@aws-sdk/client-s3";

import { FILES } from "@config";

export const initializeS3Client = () => {
  const { S3 } = FILES;

  try {
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
  } catch (error) {
    console.log(error);

    throw Error("Failed to initialize S3 CLIENT!");
  }
};
