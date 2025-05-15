export interface PortAuth {
  appName(): string;
  baseURL(): string;
  secret(): string;
}
