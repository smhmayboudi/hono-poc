import * as crypto from "node:crypto";

import { generateRandomString, type RandomReader } from "@oslojs/crypto/random";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url } from "@oslojs/encoding";
import type { Cookie } from "react-router";

import { csrfCookie } from "~/cookie.server";
import { getEnvServer } from "~/env.server";

const randomString = (bytes = 10) => {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes);
    },
  };
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

  return generateRandomString(random, alphabet, bytes);
};

const getHeaders = (requestOrHeaders: Request | Headers): Headers => {
  return requestOrHeaders instanceof Request
    ? requestOrHeaders.headers
    : requestOrHeaders;
};

export type CSRFErrorCode =
  | "invalid_token_in_cookie"
  | "mismatched_token"
  | "missing_token_in_body"
  | "missing_token_in_cookie"
  | "tampered_token_in_cookie";

export class CSRFError extends Error {
  code: CSRFErrorCode;

  constructor(code: CSRFErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "CSRFError";
  }
}

interface CSRFOptions {
  /**
   * The cookie object to use for serializing and parsing the CSRF token.
   */
  cookie: Cookie;
  /**
   * The name of the form data key to use for the CSRF token.
   */
  formDataKey?: string;
  /**
   * A secret to use for signing the CSRF token.
   */
  secret?: string;
}

export class CSRF {
  private cookie: Cookie;
  private formDataKey: string;
  private secret?: string;

  constructor(options: CSRFOptions) {
    this.cookie = options.cookie;
    this.formDataKey = options.formDataKey ?? "csrf";
    this.secret = options.secret;
  }

  private parseCookie(data: FormData | Request, headers?: Headers) {
    const _headers = data instanceof Request ? data.headers : headers;

    return _headers ? this.cookie.parse(_headers.get("cookie")) : null;
  }

  private sign(token: string) {
    return this.secret
      ? encodeBase64url(sha256(new TextEncoder().encode(token)))
      : token;
  }

  private verifySignature(token: string) {
    if (!this.secret) {
      return true;
    }
    const [value, signature] = token.split(".");
    if (!value) {
      return false;
    }

    return signature === this.sign(value);
  }

  /**
   * Generates a random string in Base64URL to be used as an authenticity token
   * for CSRF protection.
   * @param bytes The number of bytes used to generate the token
   * @returns A random string in Base64URL
   */
  generate(bytes = 32) {
    const token = randomString(bytes);

    return this.secret ? `${token}.${this.sign(token)}` : token;
  }

  /**
   * Verify if a request and cookie has a valid CSRF token.
   * @example
   * export async function action({ request }: Route.ActionArgs) {
   *   await csrf.validate(request);
   *   // the request is authenticated and you can do anything here
   * }
   * @example
   * export async function action({ request }: Route.ActionArgs) {
   *   const formData = await request.formData()
   *   await csrf.validate(formData, request.headers);
   *   // the request is authenticated and you can do anything here
   * }
   * @example
   * export async function action({ request }: Route.ActionArgs) {
   *   const formData = await parseMultipartFormData(request);
   *   await csrf.validate(formData, request.headers);
   *   // the request is authenticated and you can do anything here
   * }
   */
  validate(data: Request): Promise<void>;
  validate(data: FormData, headers: Headers): Promise<void>;
  async validate(data: FormData | Request, headers?: Headers): Promise<void> {
    if (data instanceof Request && data.bodyUsed) {
      throw new Error(
        "The body of the request was read before calling CSRF#verify. Ensure you clone it before reading it.",
      );
    }
    const formData = await this.readBody(data);
    const cookie = await this.parseCookie(data, headers);
    // if the session doesn't have a csrf token, throw an error
    if (cookie === null) {
      throw new CSRFError(
        "missing_token_in_cookie",
        "Can't find CSRF token in cookie.",
      );
    }
    if (typeof cookie !== "string") {
      throw new CSRFError(
        "invalid_token_in_cookie",
        "Invalid CSRF token in cookie.",
      );
    }
    if (this.verifySignature(cookie) === false) {
      throw new CSRFError(
        "tampered_token_in_cookie",
        "Tampered CSRF token in cookie.",
      );
    }
    // if the body doesn't have a csrf token, throw an error
    if (!formData.get(this.formDataKey)) {
      throw new CSRFError(
        "missing_token_in_body",
        "Can't find CSRF token in body.",
      );
    }
    // if the body csrf token doesn't match the session csrf token, throw an
    // error
    if (formData.get(this.formDataKey) !== cookie) {
      throw new CSRFError(
        "mismatched_token",
        "Can't verify CSRF token authenticity.",
      );
    }
  }

  /**
   * Generates a token and serialize it into the cookie.
   * @param requestOrHeaders A request or headers object from which we can
   * get the cookie to get the existing token.
   * @param bytes The number of bytes used to generate the token
   * @returns A tuple with the token and the string to send in Set-Cookie
   * If there's already a csrf value in the cookie then the token will
   * be the same and the cookie will be null.
   * @example
   * const [token, cookie] = await csrf.commitToken(request);
   * return json({ token }, {
   *   headers: { "set-cookie": cookie }
   * })
   */
  async commitToken(
    requestOrHeaders: Request | Headers = new Headers(),
    bytes = 32,
  ) {
    const headers = getHeaders(requestOrHeaders);
    const existingToken = await this.cookie.parse(headers.get("cookie"));
    const token =
      typeof existingToken === "string" ? existingToken : this.generate(bytes);
    const cookie = existingToken ? null : await this.cookie.serialize(token);

    return [token, cookie] as const;
  }

  /**
   * Get the existing token from the cookie or generate a new one if it doesn't
   * exist.
   * @param requestOrHeaders A request or headers object from which we can
   * get the cookie to get the existing token.
   * @param bytes The number of bytes used to generate the token.
   * @returns The existing token if it exists in the cookie, otherwise a new
   * token.
   */
  async getToken(
    requestOrHeaders: Request | Headers = new Headers(),
    bytes = 32,
  ) {
    const headers = getHeaders(requestOrHeaders);
    const existingToken = await this.cookie.parse(headers.get("cookie"));
    const token =
      typeof existingToken === "string" ? existingToken : this.generate(bytes);

    return token;
  }

  private async readBody(data: FormData | Request) {
    return data instanceof FormData ? data : await data.clone().formData();
  }
}

export const csrf = new CSRF({
  cookie: csrfCookie,
  formDataKey: "csrf",
  secret: getEnvServer().CSRF_SECRET,
});
