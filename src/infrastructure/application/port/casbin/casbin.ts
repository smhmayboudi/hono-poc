export interface PortCasbin {
  authorizer: (
    method: string,
    path: string,
    userId: string,
  ) => Promise<boolean>;
}
