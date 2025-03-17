# Architecture

```SHELL
/src
 │
 ├── domain/
 │   ├── adapter/
 │   │   ├── driven/
 │   │   │   └── ...
 │   │   └── driving/
 │   │       └── ...
 │   └── application/
 │       ├── domain/
 │       │   └── ...
 │       ├── error/
 │       │   └── ...
 │       ├── port/
 │       │   ├── driven/
 │       │   │   └── ...
 │       │   └── driving/
 │       │       └── ...
 │       └── use-case/
 │           └── ...
 │
 ├── infrastructure/
 │   ├── adapter/
 │   │   ├── auth/
 │   │   │   └── ...
 │   │   ├── cacher/
 │   │   │   └── ...
 │   │   ├── casbin/
 │   │   │   └── ...
 │   │   ├── config/
 │   │   │   └── ...
 │   │   ├── database/
 │   │   │   └── ...
 │   │   ├── elasticsearch/
 │   │   │   └── ...
 │   │   ├── event-emitter/
 │   │   │   └── ...
 │   │   ├── generate/
 │   │   │   └── ...
 │   │   ├── logger/
 │   │   │   └── ...
 │   │   ├── middleware/
 │   │   │   ├── casbin
 │   │   │   ├── logger
 │   │   │   └── opentelemetry
 │   │   ├── opentelemetry/
 │   │   │   └── ...
 │   │   └── slugify/
 │   │       └── ...
 │   └── port/
 │       ├── auth/
 │       │   └── ...
 │       ├── cacher/
 │       │   └── ...
 │       ├── casbin/
 │       │   └── ...
 │       ├── config/
 │       │   └── ...
 │       ├── database/
 │       │   └── ...
 │       ├── elasticsearch/
 │       │   └── ...
 │       ├── event-emitter/
 │       │   └── ...
 │       ├── generate/
 │       │   └── ...
 │       ├── logger/
 │       │   └── ...
 │       ├── opentelemetry/
 │       │   └── ...
 │       ├── queue/
 │       │   └── ...
 │       └── slugify/
 │           └── ...
 │
 ├── shared/
 │   ├── adapter/
 │   │   ├── driven/
 │   │   │   └── ...
 │   │   └── driving/
 │   │       └── ...
 │   └── application/
 │       ├── error/
 │       │   └── ...
 │       └── port/
 │           ├── driving/
 │           │   └── ...
 │           └── driven/
 │               └── ...
 └── util/
     └── ...

/test/
 └── e2e/
     └── ...
```

## Overview

Each use-case should define only one driven port, while other driving ports
should be used to interact with external services, in line with the Ports and
Adapters (Hexagonal) pattern.

## Design Principles

DOMAIN can be any module name.

- files src/domain/DOMAIN/ should not depend on src/test/.

- files src/domain/DOMAIN/adapter/driven/ should depend on same DOMAIN src/domain/DOMAIN/application/error/.
- files src/domain/DOMAIN/adapter/driven/ should depend on same DOMAIN src/domain/DOMAIN/application/port/driven/.
- files src/domain/DOMAIN/adapter/driven/ should depend on src/infrastructure/adapter/opentelemetry/.
- files src/domain/DOMAIN/adapter/driven/ should depend on src/infrastructure/application/port/.
- files src/domain/DOMAIN/adapter/driven/ should depend on src/shared/adapter/driven/.
- files src/domain/DOMAIN/adapter/driven/ should depend on src/shared/application/error/.

- files src/domain/DOMAIN/adapter/driving/ should depend on same DOMAIN src/domain/DOMAIN/adapter/driving/.
- files src/domain/DOMAIN/adapter/driving/ should depend on same DOMAIN src/domain/DOMAIN/application/error/.
- files src/domain/DOMAIN/adapter/driving/ should depend on same DOMAIN src/domain/DOMAIN/application/port/driving/.
- files src/domain/DOMAIN/adapter/driving/ should depend on src/env.ts.
- files src/domain/DOMAIN/adapter/driving/ should depend on src/infrastructure/adapter/opentelemetry/.
- files src/domain/DOMAIN/adapter/driving/ should depend on src/infrastructure/application/port/.
- files src/domain/DOMAIN/adapter/driving/ should depend on src/shared/adapter/driving/.
- files src/domain/DOMAIN/adapter/driving/ should depend on src/shared/application/error/.
- files src/domain/DOMAIN/adapter/driving/ should depend on src/util/.

- files src/domain/DOMAIN/application/domain/ should not depend on anything.
- files src/domain/DOMAIN/application/error/ should not depend on anything.
- files src/domain/DOMAIN/application/port/driven/ should depend on same DOMAIN src/domain/DOMAIN/application/domain/.
- files src/domain/DOMAIN/application/port/driven/ should depend on src/shared/application/port/.
- files src/domain/DOMAIN/application/port/driving/ should depend on same DOMAIN src/domain/DOMAIN/application/domain/.
- files src/domain/DOMAIN/application/port/driving/ should depend on src/shared/application/port/.
- files src/domain/DOMAIN/application/use-case/ should depend on same DOMAIN src/domain/DOMAIN/application/error/.
- files src/domain/DOMAIN/application/use-case/ should depend on same DOMAIN src/domain/DOMAIN/application/port/driven/.
- files src/domain/DOMAIN/application/use-case/ should depend on same DOMAIN src/domain/DOMAIN/application/port/driving/.
- files src/domain/DOMAIN/application/use-case/ should depend on same DOMAIN src/domain/DOMAIN/application/use-case/.
- files src/domain/DOMAIN/application/use-case/ should depend on src/infrastructure/adapter/opentelemetry/.
- files src/domain/DOMAIN/application/use-case/ should depend on src/infrastructure/application/port/.
- files src/domain/DOMAIN/application/use-case/ should depend on src/shared/application/error/.
- files src/domain/DOMAIN/application/use-case/ should depend on src/util/.

- files src/infrastructure/ should not depend on src/domain/.
- files src/infrastructure/ should not depend on src/shared/.
- files src/infrastructure/ should not depend on src/test/.

- files src/shared/ should not depend on src/test/.
- files src/shared/adapter/driven/ should not depend on src/infrastructure/application/port/.
- files src/shared/adapter/driving/ should depend on src/infrastructure/application/port/.
- files src/shared/application/error/ should not depend on anything.

## References

### Architecture References

- [8thlight](https://8thlight.com/insights/a-color-coded-guide-to-ports-and-adapters)
- [codesoapbox](https://codesoapbox.dev/ports-adapters-aka-hexagonal-architecture-explained/)
- [jmgarridopaz](https://jmgarridopaz.github.io/content/articles.html)
- [christianinyekaka](https://medium.com/@christianinyekaka/building-a-rest-api-a-hexagonal-approach-with-typescript-typeorm-postgresql-and-jwt-946d372860ee)
- [sketchingdev](https://sketchingdev.co.uk/blog/lets-apply-hexagonal-architecture.html)

### Coding References

- [DASPRiD](https://github.com/DASPRiD/jsonapi-zod-query)
- [davidhavl](https://github.com/DavidHavl/hono-rest-api-starter)
- [dyarleniber](https://github.com/dyarleniber/simple-blog-application-backend-challenge)
