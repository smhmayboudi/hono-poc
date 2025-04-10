import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultRoles,
  defaultStatements,
} from "better-auth/plugins/admin/access";

export const statements = {
  ...defaultStatements,
  userPOC: ["create", "delete", "read", "readID", "update"],
  userPOCInformation: ["create", "delete", "read", "readID", "update"],
  userPOCView: ["create", "delete", "read", "readID", "search", "update"],
} as const;

export const ac = createAccessControl(statements);

export const adminAc = ac.newRole({
  ...defaultRoles.admin.statements,
  userPOC: ["create", "delete", "read", "readID", "update"],
  userPOCInformation: ["create", "delete", "read", "readID", "update"],
  userPOCView: ["create", "delete", "read", "readID", "search", "update"],
});

export const userAc = ac.newRole({
  ...defaultRoles.user.statements,
  userPOC: ["create", "delete", "read", "readID", "update"],
  userPOCInformation: ["create", "delete", "read", "readID", "update"],
  userPOCView: ["create", "delete", "read", "readID", "search", "update"],
});

export const roles = {
  admin: adminAc,
  user: userAc,
};
