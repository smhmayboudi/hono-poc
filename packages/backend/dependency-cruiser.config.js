/**
 * @type {import('dependency-cruiser').IConfiguration}
 */
export default {
  forbidden: [
    {
      comment:
        "This dependency is part of a circular relationship. You might want to revise " +
        "your solution (i.e. use dependency inversion, make sure the modules have a single responsibility).",
      from: {},
      name: "no-circular",
      severity: "warn",
      to: {
        circular: true,
      },
    },
    {
      comment:
        "This is an orphan module - it's likely not used (anymore?). Either use it or " +
        "remove it. If it's logical this module is an orphan (i.e. it's a config file), " +
        "add an exception for it in your dependency-cruiser configuration. By default " +
        "this rule does not scrutinize dot-files (e.g. .eslintrc.js), TypeScript declaration " +
        "files (.d.ts), tsconfig.json and some of the babel and webpack configs.",
      from: {
        orphan: true,
        pathNot: [
          "(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$",
          "[.]d[.]ts$",
          "(^|/)tsconfig[.]json$",
          "(^|/)(?:babel|webpack)[.]config[.](?:js|cjs|mjs|ts|cts|mts|json)$",
        ],
      },
      name: "no-orphans",
      severity: "warn",
      to: {},
    },
    {
      comment:
        "A module depends on a node core module that has been deprecated. Find an alternative - these are " +
        "bound to exist - node doesn't deprecate lightly.",
      from: {},
      name: "no-deprecated-core",
      severity: "warn",
      to: {
        dependencyTypes: ["core"],
        path: [
          "^v8/tools/codemap$",
          "^v8/tools/consarray$",
          "^v8/tools/csvparser$",
          "^v8/tools/logreader$",
          "^v8/tools/profile_view$",
          "^v8/tools/profile$",
          "^v8/tools/SourceMap$",
          "^v8/tools/splaytree$",
          "^v8/tools/tickprocessor-driver$",
          "^v8/tools/tickprocessor$",
          "^node-inspect/lib/_inspect$",
          "^node-inspect/lib/internal/inspect_client$",
          "^node-inspect/lib/internal/inspect_repl$",
          "^async_hooks$",
          "^punycode$",
          "^domain$",
          "^constants$",
          "^sys$",
          "^_linklist$",
          "^_stream_wrap$",
        ],
      },
    },
    {
      comment:
        "This module uses a (version of an) npm module that has been deprecated. Either upgrade to a later " +
        "version of that module, or find an alternative. Deprecated modules are a security risk.",
      from: {},
      name: "not-to-deprecated",
      severity: "warn",
      to: {
        dependencyTypes: ["deprecated"],
      },
    },
    {
      comment:
        "This module depends on an npm package that isn't in the 'dependencies' section of your package.json. " +
        "That's problematic as the package either (1) won't be available on live (2 - worse) will be " +
        "available on live with an non-guaranteed version. Fix it by adding the package to the dependencies " +
        "in your package.json.",
      from: {},
      name: "no-non-package-json",
      severity: "error",
      to: {
        dependencyTypes: ["npm-no-pkg", "npm-unknown"],
      },
    },
    {
      comment:
        "This module depends on a module that cannot be found ('resolved to disk'). If it's an npm " +
        "module: add it to your package.json. In all other cases you likely already know what to do.",
      from: {},
      name: "not-to-unresolvable",
      severity: "error",
      to: {
        couldNotResolve: true,
      },
    },
    {
      comment:
        "Likely this module depends on an external ('npm') package that occurs more than once " +
        "in your package.json i.e. bot as a devDependencies and in dependencies. This will cause " +
        "maintenance problems later on.",
      from: {},
      name: "no-duplicate-dep-types",
      severity: "warn",
      to: {
        dependencyTypesNot: ["type-only"],
        moreThanOneDependencyType: true,
      },
    },
    {
      comment:
        "This module depends on a spec (test) file. The sole responsibility of a spec file is to test code. " +
        "If there's something in a spec that's of use to other modules, it doesn't have that single " +
        "responsibility anymore. Factor it out into (e.g.) a separate utility/ helper or a mock.",
      from: {},
      name: "not-to-spec",
      severity: "error",
      to: {
        path: ["[.](?:spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$"],
      },
    },
    {
      comment:
        "This module depends on an npm package from the 'devDependencies' section of your " +
        "package.json. It looks like something that ships to production, though. To prevent problems " +
        "with npm packages that aren't there on production declare it (only!) in the 'dependencies'" +
        "section of your package.json. If this module is development only - add it to the " +
        "from.pathNot re of the not-to-dev-dep rule in the dependency-cruiser configuration",
      from: {
        path: ["^(src)"],
        pathNot: ["[.](?:spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$"],
      },
      name: "not-to-dev-dep",
      severity: "error",
      to: {
        dependencyTypes: ["npm-dev"],
        dependencyTypesNot: ["type-only"],
        pathNot: ["node_modules/@types/"],
      },
    },
    {
      comment:
        "This module depends on an npm package that is declared as an optional dependency " +
        "in your package.json. As this makes sense in limited situations only, it's flagged here. " +
        "If you're using an optional dependency here by design - add an exception to your" +
        "dependency-cruiser configuration.",
      from: {},
      name: "optional-deps-used",
      severity: "info",
      to: {
        dependencyTypes: ["npm-optional"],
      },
    },
    {
      comment:
        "This module depends on an npm package that is declared as a peer dependency " +
        "in your package.json. This makes sense if your package is e.g. a plugin, but in " +
        "other cases - maybe not so much. If the use of a peer dependency is intentional " +
        "add an exception to your dependency-cruiser configuration.",
      from: {},
      name: "peer-deps-used",
      severity: "warn",
      to: {
        dependencyTypes: ["npm-peer"],
      },
    },
    // General rules
    {
      comment:
        "src/domain/, src/shared/, and src/infrastructure/ should not depend on src/test/",
      from: { path: ["^src/(domain|shared|infrastructure)/"] },
      name: "no-test-dependency",
      severity: "error",
      to: { path: ["^src/test/"] },
    },
    // src/domain/DOMAIN rules
    {
      comment:
        "Driven adapters in src/domain/DOMAIN/adapter/driven/ must only depend on allowed paths.",
      from: { path: ["^src/domain/[^/]+/adapter/driven/"] },
      name: "domain-adapter-driven-deps",
      severity: "error",
      to: {
        pathNot: [
          "^src/domain/[^/]+/application/error/",
          "^src/domain/[^/]+/application/port/driven/",
          "^src/infrastructure/adapter/opentelemetry/",
          "^src/infrastructure/application/port/",
          "^src/shared/adapter/driven/",
          "^src/shared/application/error/",
        ],
      },
    },
    {
      comment:
        "Driving adapters in src/domain/DOMAIN/adapter/driving/ must only depend on allowed paths.",
      from: { path: ["^src/domain/[^/]+/adapter/driving/"] },
      name: "domain-adapter-driving-deps",
      severity: "error",
      to: {
        pathNot: [
          "^src/domain/[^/]+/adapter/driving/",
          "^src/domain/[^/]+/application/error/",
          "^src/domain/[^/]+/application/port/driving/",
          "^src/env.ts",
          "^src/infrastructure/adapter/opentelemetry/",
          "^src/infrastructure/application/port/",
          "^src/shared/adapter/driving/",
          "^src/shared/application/error/",
          "^src/util/",
        ],
      },
    },
    {
      comment: "Domain models must not depend on anything.",
      from: { path: ["^src/domain/[^/]+/application/domain/"] },
      name: "domain-application-domain-no-deps",
      severity: "error",
      to: { path: [".+"] },
    },
    {
      comment: "Error classes must not depend on anything.",
      from: { path: ["^src/domain/[^/]+/application/error/"] },
      name: "domain-application-error-no-deps",
      severity: "error",
      to: { path: [".+"] },
    },
    {
      comment: "Driven ports must only depend on allowed paths.",
      from: { path: ["^src/domain/[^/]+/application/port/driven/"] },
      name: "domain-application-port-driven-deps",
      severity: "error",
      to: {
        pathNot: [
          "^src/domain/[^/]+/application/domain/",
          "^src/shared/application/port/",
        ],
      },
    },
    {
      comment: "Driving ports must only depend on allowed paths.",
      from: { path: ["^src/domain/[^/]+/application/port/driving/"] },
      name: "domain-application-port-driving-deps",
      severity: "error",
      to: {
        pathNot: [
          "^src/domain/[^/]+/application/domain/",
          "^src/shared/application/port/",
        ],
      },
    },
    {
      comment: "Use cases must only depend on allowed paths.",
      from: { path: ["^src/domain/[^/]+/application/use-case/"] },
      name: "domain-application-use-case-deps",
      severity: "error",
      to: {
        pathNot: [
          "^src/domain/[^/]+/application/error/",
          "^src/domain/[^/]+/application/port/driven/",
          "^src/domain/[^/]+/application/port/driving/",
          "^src/domain/[^/]+/application/use-case/",
          "^src/infrastructure/adapter/opentelemetry/",
          "^src/infrastructure/application/port/",
          "^src/shared/application/error/",
          "^src/util/",
        ],
      },
    },
    // src/infrastructure rules
    {
      comment: "Infrastructure must not depend on domain.",
      from: { path: ["^src/infrastructure/"] },
      name: "infrastructure-no-domain",
      severity: "error",
      to: { path: ["^src/domain/"] },
    },
    {
      comment: "Infrastructure must not depend on shared.",
      from: { path: ["^src/infrastructure/"] },
      name: "infrastructure-no-shared",
      severity: "error",
      to: { path: ["^src/shared/"] },
    },
    // src/shared rules
    {
      comment: "Shared must not depend on infrastructure.",
      from: { path: ["^src/shared/"] },
      name: "shared-no-infrastructure",
      severity: "error",
      to: {
        path: ["^src/infrastructure/"],
        pathNot: ["^src/infrastructure/application/port/"],
      },
    },
    {
      comment: "Shared application errors must not depend on anything.",
      from: { path: ["^src/shared/application/error/"] },
      name: "shared-application-error-no-deps",
      severity: "error",
      to: { path: [".+"] },
    },
  ],
  options: {
    combinedDependencies: false,
    doNotFollow: {
      path: ["node_modules"],
    },
    enhancedResolveOptions: {
      aliasFields: [],
      conditionNames: ["import", "require", "node", "default", "types"],
      exportsFields: ["exports"],
      extensions: [".d.ts", ".ts"],
      mainFields: ["module", "main", "types", "typings"],
    },
    exclude: {
      path: ["build", "node_modules"],
    },
    extraExtensionsToScan: [".json"],
    includeOnly: [],
    moduleSystems: ["amd", "cjs", "es6", "tsd"],
    prefix: `vscode://file/${process.cwd()}/`,
    preserveSymlinks: false,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    tsPreCompilationDeps: true,
    exoticRequireStrings: [],
    reporterOptions: {
      archi: {
        collapsePattern:
          "^(?:packages|src|lib(s?)|app(s?)|bin|test(s?)|spec(s?))/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)",
      },
      dot: {
        collapsePattern: "node_modules/(?:@[^/]+/[^/]+|[^/]+)",
        theme: {
          graph: {
            splines: "ortho",
          },
        },
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
