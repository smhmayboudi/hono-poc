import type { BatchAdapter, Model, UpdatableAdapter } from "casbin";
import { Helper } from "casbin";
import { and, eq, isNull } from "drizzle-orm";

import type { PortDatabase } from "../../application/port/database/database.ts";
import { casbin } from "../../application/port/database/schema/schema.ts";

type CasinSelect = typeof casbin.$inferSelect;
type CasinInsert = typeof casbin.$inferInsert;

export class CasbinDrizzleAdapter implements BatchAdapter, UpdatableAdapter {
  constructor(private readonly database: PortDatabase) {}

  loadPolicyLine(line: CasinSelect, model: Model): void {
    const result = `${line.ptype}, ${[line.v0, line.v1, line.v2, line.v3, line.v4, line.v5].join(", ")}`;
    Helper.loadPolicyLine(result, model);
  }

  savePolicyLine(ptype: string, rule: string[]): CasinInsert {
    const line: CasinInsert = { ptype };
    if (rule.length > 0) {
      line.v0 = rule[0];
    }
    if (rule.length > 1) {
      line.v1 = rule[1];
    }
    if (rule.length > 2) {
      line.v2 = rule[2];
    }
    if (rule.length > 3) {
      line.v3 = rule[3];
    }
    if (rule.length > 4) {
      line.v4 = rule[4];
    }
    if (rule.length > 5) {
      line.v5 = rule[5];
    }

    return line;
  }

  async addPolicies(
    sec: string,
    ptype: string,
    rules: string[][],
  ): Promise<void> {
    for (const rule of rules) {
      await this.addPolicy(sec, ptype, rule);
    }
  }

  async addPolicy(_sec: string, ptype: string, rule: string[]): Promise<void> {
    const line = this.savePolicyLine(ptype, rule);
    await this.database.db().insert(casbin).values(line).execute();
  }

  async loadPolicy(model: Model): Promise<void> {
    const lines: CasinSelect[] = await this.database
      .db()
      .select()
      .from(casbin)
      .execute();
    for (const line of lines) {
      this.loadPolicyLine(line, model);
    }
  }

  async removeFilteredPolicy(
    _sec: string,
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<void> {
    const line: CasinInsert = { ptype };
    const idx = fieldIndex + fieldValues.length;
    if (fieldIndex <= 0 && idx > 0) {
      line.v0 = fieldValues[0 - fieldIndex];
    }
    if (fieldIndex <= 1 && idx > 1) {
      line.v1 = fieldValues[1 - fieldIndex];
    }
    if (fieldIndex <= 2 && idx > 2) {
      line.v2 = fieldValues[2 - fieldIndex];
    }
    if (fieldIndex <= 3 && idx > 3) {
      line.v3 = fieldValues[3 - fieldIndex];
    }
    if (fieldIndex <= 4 && idx > 4) {
      line.v4 = fieldValues[4 - fieldIndex];
    }
    if (fieldIndex <= 5 && idx > 5) {
      line.v5 = fieldValues[5 - fieldIndex];
    }
    await this.database
      .db()
      .delete(casbin)
      .where(
        and(
          line.v0 ? eq(casbin.v0, line.v0) : isNull(casbin.v0),
          line.v1 ? eq(casbin.v1, line.v1) : isNull(casbin.v1),
          line.v2 ? eq(casbin.v2, line.v2) : isNull(casbin.v2),
          line.v3 ? eq(casbin.v3, line.v3) : isNull(casbin.v3),
          line.v4 ? eq(casbin.v4, line.v4) : isNull(casbin.v4),
          line.v5 ? eq(casbin.v5, line.v5) : isNull(casbin.v5),
        ),
      )
      .execute();
  }
  async removePolicies(
    sec: string,
    ptype: string,
    rules: string[][],
  ): Promise<void> {
    for (const rule of rules) {
      await this.removePolicy(sec, ptype, rule);
    }
  }

  async removePolicy(
    _sec: string,
    ptype: string,
    rule: string[],
  ): Promise<void> {
    const line = this.savePolicyLine(ptype, rule);
    await this.database
      .db()
      .delete(casbin)
      .where(
        and(
          line.v0 ? eq(casbin.v0, line.v0) : isNull(casbin.v0),
          line.v1 ? eq(casbin.v1, line.v1) : isNull(casbin.v1),
          line.v2 ? eq(casbin.v2, line.v2) : isNull(casbin.v2),
          line.v3 ? eq(casbin.v3, line.v3) : isNull(casbin.v3),
          line.v4 ? eq(casbin.v4, line.v4) : isNull(casbin.v4),
          line.v5 ? eq(casbin.v5, line.v5) : isNull(casbin.v5),
        ),
      )
      .execute();
  }

  async savePolicy(model: Model): Promise<boolean> {
    await this.database.db().delete(casbin).execute();
    let astMap = model.model.get("p") ?? [];
    for (const [ptype, ast] of astMap) {
      for (const rule of ast.policy) {
        const line = this.savePolicyLine(ptype, rule);
        await this.database.db().insert(casbin).values(line).execute();
      }
    }
    astMap = model.model.get("g") ?? [];
    for (const [ptype, ast] of astMap) {
      for (const rule of ast.policy) {
        const line = this.savePolicyLine(ptype, rule);
        await this.database.db().insert(casbin).values(line).execute();
      }
    }

    return true;
  }

  async updatePolicy(
    _sec: string,
    ptype: string,
    oldRule: string[],
    newRule: string[],
  ): Promise<void> {
    const oldLine = this.savePolicyLine(ptype, oldRule);
    const newLine = this.savePolicyLine(ptype, newRule);
    await this.database
      .db()
      .update(casbin)
      .set(newLine)
      .where(
        and(
          oldLine.v0 ? eq(casbin.v0, oldLine.v0) : isNull(casbin.v0),
          oldLine.v1 ? eq(casbin.v1, oldLine.v1) : isNull(casbin.v1),
          oldLine.v2 ? eq(casbin.v2, oldLine.v2) : isNull(casbin.v2),
          oldLine.v3 ? eq(casbin.v3, oldLine.v3) : isNull(casbin.v3),
          oldLine.v4 ? eq(casbin.v4, oldLine.v4) : isNull(casbin.v4),
          oldLine.v5 ? eq(casbin.v5, oldLine.v5) : isNull(casbin.v5),
        ),
      )
      .execute();
  }
}
