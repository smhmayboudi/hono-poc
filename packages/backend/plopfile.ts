import type { Actions } from "node-plop";
import type { NodePlopAPI } from "plop";

export default (plop: NodePlopAPI) => {
  const adapterDrivenActions: Actions = () =>
    ["create", "delete", "read", "update"].map((value) => ({
      path: `./src/{{kebabCase domain}}/adapter/driven/{{kebabCase domain}}-${value}.ts`,
      templateFile: `./plop-template/domain/adapter/driven/domain-${value}.hbs`,
      type: "add",
    }));

  const adapterDrivingActions: Actions = () =>
    ["create", "delete", "read", "update"].flatMap((crud) =>
      [
        "driving",
        "driving.test",
        "handler",
        "request",
        "response",
        "route",
      ].map((filename) => ({
        path: `./src/{{kebabCase domain}}/adapter/driving/{{kebabCase domain}}-${crud}/{{kebabCase domain}}-${crud}.${filename}.ts`,
        templateFile: `./plop-template/domain/adapter/driving/domain-${crud}/domain-${crud}.${filename}.hbs`,
        type: "add",
      })),
    );

  const adapterDrivingSlugActions: Actions = () =>
    ["create", "update"].flatMap((crud) =>
      ["driving.test", "handler", "request", "response"].map((filename) => ({
        force: true,
        path: `./src/{{kebabCase domain}}/adapter/driving/{{kebabCase domain}}-${crud}/{{kebabCase domain}}-${crud}.${filename}.ts`,
        templateFile: `./plop-template/domain/adapter/driving/slug/domain-${crud}/domain-${crud}.${filename}.hbs`,
        type: "add",
      })),
    );

  const applicationDomainActions: Actions = () => [
    {
      path: "./src/{{kebabCase domain}}/application/domain/{{kebabCase domain}}.ts",
      templateFile: "./plop-template/domain/application/domain/domain.hbs",
      type: "add",
    },
  ];

  const applicationErrorActions: Actions = () => [
    {
      path: "./src/{{kebabCase domain}}/application/error/{{kebabCase domain}}.ts",
      templateFile: "./plop-template/domain/application/error/domain.hbs",
      type: "add",
    },
  ];

  const applicationPortDrivenActions: Actions = () =>
    ["create", "delete", "read", "update"].map((value) => ({
      path: `./src/{{kebabCase domain}}/application/port/driven/{{kebabCase domain}}-${value}.ts`,
      templateFile: `./plop-template/domain/application/port/driven/domain-${value}.hbs`,
      type: "add",
    }));

  const applicationPortDrivenSlugActions: Actions = () =>
    ["create", "update"].map((value) => ({
      force: true,
      path: `./src/{{kebabCase domain}}/application/port/driven/{{kebabCase domain}}-${value}.ts`,
      templateFile: `./plop-template/domain/application/port/driven/slug/domain-${value}.hbs`,
      type: "add",
    }));

  const applicationPortDrivingActions: Actions = () =>
    ["create", "delete", "read", "update"].map((value) => ({
      path: `./src/{{kebabCase domain}}/application/port/driving/{{kebabCase domain}}-${value}.ts`,
      templateFile: `./plop-template/domain/application/port/driving/domain-${value}.hbs`,
      type: "add",
    }));

  const applicationPortDrivingSlugActions: Actions = () =>
    ["create", "update"].map((value) => ({
      force: true,
      path: `./src/{{kebabCase domain}}/application/port/driving/{{kebabCase domain}}-${value}.ts`,
      templateFile: `./plop-template/domain/application/port/driving/slug/domain-${value}.hbs`,
      type: "add",
    }));

  const applicationUseCaseActions: Actions = () =>
    ["create", "delete", "read", "update"].flatMap((crud) => [
      ...[".", ".test."].map((filename) => ({
        path: `./src/{{kebabCase domain}}/application/use-case/{{kebabCase domain}}-${crud}${filename}ts`,
        templateFile: `./plop-template/domain/application/use-case/domain-${crud}${filename}hbs`,
        type: "add",
      })),
      ...["puml"].map((filename) => ({
        path: `./src/{{kebabCase domain}}/application/use-case/{{kebabCase domain}}-${crud}.${filename}`,
        templateFile: `./plop-template/domain/application/use-case/domain-${crud}.${filename}.hbs`,
        type: "add",
      })),
    ]);

  const applicationUseCaseSlugActions: Actions = () =>
    ["create", "update"].flatMap((crud) => [
      ...[".", ".test."].map((filename) => ({
        force: true,
        path: `./src/{{kebabCase domain}}/application/use-case/{{kebabCase domain}}-${crud}${filename}ts`,
        templateFile: `./plop-template/domain/application/use-case/slug/domain-${crud}${filename}hbs`,
        type: "add",
      })),
      ...["puml"].map((filename) => ({
        force: true,
        path: `./src/{{kebabCase domain}}/application/use-case/{{kebabCase domain}}-${crud}.${filename}`,
        templateFile: `./plop-template/domain/application/use-case/slug/domain-${crud}.${filename}.hbs`,
        type: "add",
      })),
    ]);

  const domainActions: Actions = (data) => {
    const dataList = ["create", "delete", "read", "update"].map((value) => ({
      crud: value,
      domain: String(data ? data["domain"] : ""),
    }));

    return [
      {
        data: { dataList },
        path: "./src/{{kebabCase domain}}/{{kebabCase domain}}.ts",
        templateFile: "./plop-template/domain/domain.hbs",
        type: "add",
      },
    ];
  };

  plop.setGenerator("adapter.driven", {
    actions: adapterDrivenActions,
    description: "Adapter Driven",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("adapter.driving", {
    actions: adapterDrivingActions,
    description: "Adapter Driving",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("adapter.driving+slug", {
    actions: adapterDrivingSlugActions,
    description: "Adapter Driving Slug",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("application.domain", {
    actions: applicationDomainActions,
    description: "Application Domain",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("application.error", {
    actions: applicationErrorActions,
    description: "Application Error",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("application.port.driven", {
    actions: applicationPortDrivenActions,
    description: "Application Port Driven",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("application.port.driven+slug", {
    actions: applicationPortDrivenSlugActions,
    description: "Application Port Driven Slug",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("application.port.driving", {
    actions: applicationPortDrivingActions,
    description: "Application Port Driving",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("application.port.driving+slug", {
    actions: applicationPortDrivingSlugActions,
    description: "Application Port Driving Slug",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("application.use-case", {
    actions: applicationUseCaseActions,
    description: "Application Use Case",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("application.use-case+slug", {
    actions: applicationUseCaseSlugActions,
    description: "Application Use Case Slug",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("domain", {
    actions: domainActions,
    description: "Domain",
    prompts: [{ message: "please domain name", name: "domain", type: "input" }],
  });

  plop.setGenerator("all", {
    description: "Generate all parts for a domain",
    prompts: [
      {
        message: "Please enter the domain name",
        name: "domain",
        type: "input",
      },
    ],
    actions: (data) => [
      ...adapterDrivenActions(data),
      ...adapterDrivingActions(data),
      ...applicationDomainActions(data),
      ...applicationErrorActions(data),
      ...applicationPortDrivenActions(data),
      ...applicationPortDrivingActions(data),
      ...applicationUseCaseActions(data),
      ...domainActions(data),
    ],
  });

  plop.setGenerator("all+slug", {
    description: "Generate all parts for a domain",
    prompts: [
      {
        message: "Please enter the domain name",
        name: "domain",
        type: "input",
      },
    ],
    actions: (data) => [
      ...adapterDrivenActions(data),
      ...adapterDrivingActions(data),
      ...adapterDrivingSlugActions(data),
      ...applicationDomainActions(data),
      ...applicationErrorActions(data),
      ...applicationPortDrivenActions(data),
      ...applicationPortDrivenSlugActions(data),
      ...applicationPortDrivingActions(data),
      ...applicationPortDrivingSlugActions(data),
      ...applicationUseCaseActions(data),
      ...applicationUseCaseSlugActions(data),
      ...domainActions(data),
    ],
  });
};
