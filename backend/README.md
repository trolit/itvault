# backend

## Simulating s3 using LocalStack

https://docs.localstack.cloud/user-guide/aws/s3/

```sh
pip3 install "awscli-local[ver1]"
```

```sh
awslocal s3api create-bucket --bucket itvault-bucket
```

```sh
awslocal s3api list-objects --bucket itvault-bucket
```
