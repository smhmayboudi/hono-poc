# hono-poc

## Dependencies Installation

```SHELL
pnpm i
```

## Run

### Development Mode

```SHELL
docker compose up -d mysql
pnpm run db
pnpm run dev
```

OR

```SHELL
docker compose up hono-poc
```

### Production Mode

```SHELL
docker compose up -d mysql
pnpm run db:migrate
pnpm run build && pnpm run start:production
```

## Swagger UI

Note: it builds and runs hono-poc with migration.

```SHELL
docker compose up swagger-ui
```

## Test

### Unit and Integration Test

```SHELL
pnpm run test
```

### E2E Test

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
export OTEL_TRACES_EXPORTER="http"
export OTEL_EXPORTER_OTLP_ENDPOINT="http://127.0.0.1:4318"
export OTEL_NODE_RESOURCE_DETECTORS="env,host,process"
export OTEL_SERVICE_NAME="server"
export OTEL_RESOURCE_ATTRIBUTES="service.name=hono-poc,service.version=0.0.0"
export NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"
```

## K6 Test

```SHELL
docker run --rm -i --security-opt ddd grafana/k6:latest-with-browser - <script.js>

docker run --rm -i \
--env K6_DURATION=3600s \
--env K6_PROMETHEUS_RW_SERVER_URL=http://127.0.0.1:9090/api/v1/write \
--env K6_PROMETHEUS_RW_TREND_AS_NATIVE_HISTOGRAM=true \
--env K6_VUS=4 \
--env BASE_URL=http://127.0.0.1:8081/api/v1 \
--env SLEEP_DURATION=0.1 \
--volume .:/home/k6/workspace \
grafana/k6:0.58.0 run \
--compatibility-mode=base \
--config=/home/k6/workspace/test/e2e/config.json \
--out=experimental-prometheus-rw \
/home/k6/workspace/test/e2e/build/mlt.js
```
