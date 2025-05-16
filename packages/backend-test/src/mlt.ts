import { check, group, sleep } from "k6";
import http from "k6/http";
import type { Options } from "k6/options";

export const options: Options = {};

// 1. init code
const BASE_URL = __ENV["BASE_URL"] || "http://127.0.0.1:8081/api/v1";
const SLEEP_DURATION =
  (__ENV["SLEEP_DURATION"] && Number(__ENV["SLEEP_DURATION"])) || 0.1;

/**
 * Setup the Test
 */
export function setup() {
  // 2. setup code
}

/**
 * Virtual User (VU) Code
 */
export default function () {
  // 3. VU code
  group("/user-poc-view:get", () => {
    const url = `${BASE_URL}/user-poc-view`;
    const params = { headers: { "Content-Type": "application/json" } };
    const response = http.get(url, params);
    check(response, { "status is OK": (res) => res.status === 200 });
    sleep(SLEEP_DURATION);
  });
}

/**
 * Teardown the Test
 */
export function teardown() {
  // 4. teardown code
}
