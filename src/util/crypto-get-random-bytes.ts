import * as crypto from "node:crypto";

export const cryptoGetRandomBytes = (length = 32): string => {
  if (!crypto?.getRandomValues) {
    throw new Error("Crypto getRandomValues is not available");
  }
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
};
