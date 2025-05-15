const permissions = (basePath: string) => [
  {
    method: "POST",
    path: `${basePath}/user-poc`,
    permission: { userPOC: ["create"] },
  },
  {
    method: "DELETE",
    path: `${basePath}/user-poc`,
    permission: { userPOC: ["delete"] },
  },
  {
    method: "GET",
    path: `${basePath}/user-poc`,
    permission: { userPOC: ["read"] },
  },
  {
    method: "GET",
    path: `${basePath}/user-poc/`,
    permission: { userPOC: ["readID"] },
  },
  {
    method: "PATCH",
    path: `${basePath}/user-poc`,
    permission: { userPOC: ["update"] },
  },
  {
    method: "POST",
    path: `${basePath}/user-poc-information`,
    permission: { userPOCInformation: ["create"] },
  },
  {
    method: "DELETE",
    path: `${basePath}/user-poc-information`,
    permission: { userPOCInformation: ["delete"] },
  },
  {
    method: "GET",
    path: `${basePath}/user-poc-information`,
    permission: { userPOCInformation: ["read"] },
  },
  {
    method: "GET",
    path: `${basePath}/user-poc-information/`,
    permission: { userPOCInformation: ["readID"] },
  },
  {
    method: "PATCH",
    path: `${basePath}/user-poc-information`,
    permission: { userPOCInformation: ["update"] },
  },
  {
    method: "POST",
    path: `${basePath}/user-poc-view`,
    permission: { userPOCView: ["create"] },
  },
  {
    method: "DELETE",
    path: `${basePath}/user-poc-view`,
    permission: { userPOCView: ["delete"] },
  },
  {
    method: "GET",
    path: `${basePath}/user-poc-view`,
    permission: { userPOCView: ["read"] },
  },
  {
    method: "GET",
    path: `${basePath}/user-poc-view/`,
    permission: { userPOCView: ["readID"] },
  },
  {
    method: "POST",
    path: `${basePath}/user-poc-view/search`,
    permission: { userPOCView: ["search"] },
  },
  {
    method: "PATCH",
    path: `${basePath}/user-poc-view`,
    permission: { userPOCView: ["update"] },
  },
];

const transformPermissions = (
  input: Record<string, string[]>[],
): Record<string, string[]> =>
  Object.fromEntries(
    [...new Set(input.flatMap(Object.keys))].map((category) => [
      category,
      [
        ...new Set(
          input
            .filter((entry) => category in entry)
            .flatMap((entry) => entry[category] ?? ""),
        ),
      ],
    ]),
  );

export const authStatements = (basePath: string) =>
  transformPermissions(permissions(basePath).map((value) => value.permission));

const matchPath = (path: string, pattern: string) =>
  path.split("/").every((part, i) => part === pattern.split("/")[i]);

export const authPermission = (
  basePath: string,
  method: string,
  path: string,
) =>
  permissions(basePath)
    .filter(
      (value) => method.includes(value.method) && matchPath(path, value.path),
    )
    .map((value) => value.permission)[0];
