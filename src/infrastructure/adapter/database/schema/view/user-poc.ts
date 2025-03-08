import { eq, sql } from "drizzle-orm";
import { mysqlView } from "drizzle-orm/mysql-core";

import { userPOC } from "../table/user-poc.ts";
import { userPOCInformation } from "../table/user-poc-information.ts";

export const userPOCView = mysqlView("view_user_poc").as((qb) =>
  qb
    .select({
      user_poc_id: sql`${userPOC.id}`.as("user_poc_id"),
      user_poc_fullname: sql`${userPOC.fullname}`.as("user_poc_fullname"),
      user_poc_created_at: sql`${userPOC.createdAt}`.as("user_poc_created_at"),
      user_poc_updated_at: sql`${userPOC.updatedAt}`.as("user_poc_updated_at"),
      user_poc_information_id: sql`${userPOCInformation.id}`.as(
        "user_poc_information_id",
      ),
      user_poc_information_user_id: sql`${userPOCInformation.userId}`.as(
        "user_poc_information_user_id",
      ),
      user_poc_information_address: sql`${userPOCInformation.address}`.as(
        "user_poc_information_address",
      ),
      user_poc_information_age: sql`${userPOCInformation.age}`.as(
        "user_poc_information_age",
      ),
      user_poc_information_created_at: sql`${userPOCInformation.createdAt}`.as(
        "user_poc_information_created_at",
      ),
      user_poc_information_updated_at: sql`${userPOCInformation.updatedAt}`.as(
        "user_poc_information_updated_at",
      ),
    })
    .from(userPOC)
    .innerJoin(userPOCInformation, eq(userPOC.id, userPOCInformation.userId)),
);
