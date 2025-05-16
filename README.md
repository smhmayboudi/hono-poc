# hono-poc

## Dependencies Installation

```SHELL
npm i
```

## Run

### Development Mode

```SHELL
docker compose up -d mysql
npm run db
npm run dev
```

OR

```SHELL
docker compose up hono-poc
```

### Production Mode

```SHELL
docker compose up -d mysql
npm run db:migrate
npm run build && npm run start:production
```

## Swagger UI

Note: it builds and runs hono-poc with migration.

```SHELL
docker compose up swagger-ui
```

## Test

### Unit and Integration Test

```SHELL
npm run test
```

### Backend Test

Note: it builds and runs hono-poc with migration.

```SHELL
docker compose up k6
```

### Manual

```SHELL
curl -v "http://127.0.0.1:8081/api/v1/swagger.json"

curl \
-H 'Content-Type: application/vnd.api+json' \
-X POST \
-d \
'{"fullname":"Hossein Mayboudi"}'\
-v 'http://127.0.0.1:8081/api/v1/user-poc'
```

## OpenTelemetry

```SHELL
export NODE_OPTIONS=--require @opentelemetry/auto-instrumentations-node/register
export OTEL_EXPORTER_OTLP_ENDPOINT=127.0.0.1:4318
export OTEL_LOG_LEVEL=all
export OTEL_NODE_ENABLED_INSTRUMENTATIONS=http,mysql2,redis-4
export OTEL_NODE_RESOURCE_DETECTORS=env,host,process
export OTEL_RESOURCE_ATTRIBUTES=service.name=hono-poc,service.version=0.0.0
export OTEL_SERVICE_NAME=server
export OTEL_TRACES_EXPORTER=http
```

## K6 Test

```SHELL
docker run --rm -i --security-opt ddd grafana/k6:latest-with-browser - <script.js>

docker run --rm -i \
--add-host host.docker.internal:host-gateway \
--env K6_OTEL_HTTP_EXPORTER_ENDPOINT=host.docker.internal:4318 \
--env K6_OTEL_HTTP_EXPORTER_INSECURE=true \
--env BASE_URL=http://host.docker.internal:8081/api/v1 \
--env SLEEP_DURATION=0.1 \
--volume .:/home/k6/workspace \
grafana/k6:0.58.0 run \
--compatibility-mode=base \
--config=/home/k6/workspace/packages/backend-test/config.json \
--out=experimental-opentelemetry \
/home/k6/workspace/packages/backend-test/build/mlt.js
```
