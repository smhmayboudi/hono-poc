import type { Context } from "hono";

import type { Env } from "../../../../env.ts";

export type Session = {
  session: {
    createdAt: Date;
    expiresAt: Date;
    id: string;
    ipAddress?: string | null | undefined;
    token: string;
    updatedAt: Date;
    userAgent?: string | null | undefined;
    userId: string;
  };
  user: {
    createdAt: Date;
    email: string;
    emailVerified: boolean;
    id: string;
    image?: string | null | undefined;
    name: string;
    phoneNumber?: string | null | undefined;
    phoneNumberVerified?: boolean | null | undefined;
    updatedAt: Date;
    username?: string | null | undefined;
  };
};

export interface PortAuth {
  handler(request: Request): Promise<Response>;
  roleHasPermission(
    permission: Record<string, string[]>,
    role: string,
  ): Promise<boolean>;
  session(ctx: Context<Env>): Promise<Session | null>;
  userHasPermission(
    permission: Record<string, string[]>,
    userId: string,
  ): Promise<boolean>;
}
