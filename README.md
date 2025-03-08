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
