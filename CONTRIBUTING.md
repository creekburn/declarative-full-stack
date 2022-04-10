
## Tool Chain

* Node JS
* Docker
* Docker Compose

## Development Commands
Run the `docker-compose` command on any changes to the `api` directory.
```bash
npm run watch
```

### Docker-Compose Commands
Commands to run the application and dependences using docker-compose.

```bash
# Run everything in detached mode
docker-compose up --build --remove-orphans -d
# Follow all Logs
docker-compose logs -f
# Stop All Services
docker-compose down
```

### Docker Commands
Command to build run just the lambda container.

```bash
# Build Code Changes into Container
docker build . -t test-lambda
# Run container locally
docker run --rm -d --name test-lambda -p 9000:8080 test-lambda
# Follow logs for container
docker logs -f test-lambda
# Stop container
docker stop test-lambda
```

## Testing API
Container is built execute as an AWS lambda.  AWS lambdas are invoked with and Event.
So depending on how the lambda is used, the Event will need to structured differently.
We are aiming to only use API Gateway Events.

Make the following type of request to the running container.
```bash 
curl -X POST 'http://localhost:9000/2015-03-31/functions/function/invocations' \
  -H "Content-Type: application/json"
  -d ${EVENT_JSON} 
```

Here is an [example event JSON](https://github.com/awsdocs/aws-lambda-developer-guide/blob/main/sample-apps/nodejs-apig/event.json) 
to mimic an API Gateway Event.
```json
{
    "resource": "/",
    "path": "/api/todo",
    "httpMethod": "GET",
    "body": "{}",
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "cookie": "s_fid=7AAB6XMPLAFD9BBF-0643XMPL09956DE2; regStatus=pre-register",
        "Host": "70ixmpl4fl.execute-api.us-east-2.amazonaws.com",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "upgrade-insecure-requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
        "X-Amzn-Trace-Id": "Root=1-5e66d96f-7491f09xmpl79d18acf3d050",
        "X-Forwarded-For": "52.255.255.12",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "multiValueHeaders": {
        "accept": [
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        ],
        "accept-encoding": [
            "gzip, deflate, br"
        ],
        "accept-language": [
            "en-US,en;q=0.9"
        ],
        "cookie": [
            "s_fid=7AABXMPL1AFD9BBF-0643XMPL09956DE2; regStatus=pre-register;"
        ],
        "Host": [
            "70ixmpl4fl.execute-api.ca-central-1.amazonaws.com"
        ],
        "sec-fetch-dest": [
            "document"
        ],
        "sec-fetch-mode": [
            "navigate"
        ],
        "sec-fetch-site": [
            "none"
        ],
        "upgrade-insecure-requests": [
            "1"
        ],
        "User-Agent": [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"
        ],
        "X-Amzn-Trace-Id": [
            "Root=1-5e66d96f-7491f09xmpl79d18acf3d050"
        ],
        "X-Forwarded-For": [
            "52.255.255.12"
        ],
        "X-Forwarded-Port": [
            "443"
        ],
        "X-Forwarded-Proto": [
            "https"
        ]
    },
    "queryStringParameters": null,
    "multiValueQueryStringParameters": null,
    "pathParameters": null,
    "stageVariables": null,
    "requestContext": {
        "resourceId": "2gxmpl",
        "resourcePath": "/",
        "httpMethod": "GET",
        "extendedRequestId": "JJbxmplHYosFVYQ=",
        "requestTime": "10/Mar/2020:00:03:59 +0000",
        "path": "/Prod/",
        "accountId": "123456789012",
        "protocol": "HTTP/1.1",
        "stage": "Prod",
        "domainPrefix": "70ixmpl4fl",
        "requestTimeEpoch": 1583798639428,
        "requestId": "77375676-xmpl-4b79-853a-f982474efe18",
        "identity": {
            "cognitoIdentityPoolId": null,
            "accountId": null,
            "cognitoIdentityId": null,
            "caller": null,
            "sourceIp": "52.255.255.12",
            "principalOrgId": null,
            "accessKey": null,
            "cognitoAuthenticationType": null,
            "cognitoAuthenticationProvider": null,
            "userArn": null,
            "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
            "user": null
        },
        "domainName": "70ixmpl4fl.execute-api.us-east-2.amazonaws.com",
        "apiId": "70ixmpl4fl"
    },
    "isBase64Encoded": false
}
```