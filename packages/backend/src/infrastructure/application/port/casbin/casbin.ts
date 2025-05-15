export interface PortCasbin {
  addGroupingPolicy(...params: string[]): Promise<boolean>;
  addPolicies(rules: string[][]): Promise<boolean>;
  enforce: (method: string, path: string, userId: string) => Promise<boolean>;
}
