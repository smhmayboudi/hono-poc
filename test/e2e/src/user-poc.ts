// @ts-ignore
import { randomString } from "https://jslib.k6.io/k6-utils/1.5.0/index.js";
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
  group("/user-poc:del", () => {
    const id = 1234567890;
    const url = `${BASE_URL}/user-poc/${id}`;
    const body = JSON.stringify({});
    const params = {
      headers: { "Content-Type": "application/json" },
    };
    const response = http.del(url, body, params);
    check(response, {
      "status is OK": (res) => res.status === 200,
    });
    sleep(SLEEP_DURATION);
  });
  group("/user-poc:get", () => {
    const url = `${BASE_URL}/user-poc`;
    const params = {
      headers: { "Content-Type": "application/json" },
    };
    const response = http.get(url, params);
    check(response, {
      "status is OK": (res) => res.status === 200,
    });
    sleep(SLEEP_DURATION);
  });
  group("/user-poc:getID", () => {
    const id = 1234567890;
    const url = `${BASE_URL}/user-poc/${id}`;
    const params = {
      headers: { "Content-Type": "application/json" },
    };
    const response = http.get(url, params);
    check(response, {
      "status is OK": (res) => res.status === 200,
    });
    sleep(SLEEP_DURATION);
  });
  group("/user-poc:patch", () => {
    const id = 1234567890;
    const url = `${BASE_URL}/user-poc/${id}`;
    const body = JSON.stringify({
      fullname: randomString(10),
    });
    const params = {
      headers: { "Content-Type": "application/json" },
    };
    const response = http.patch(url, body, params);
    check(response, {
      "status is OK": (res) => res.status === 200,
    });
    sleep(SLEEP_DURATION);
  });
  group("/user-poc:post", () => {
    const url = `${BASE_URL}/user-poc`;
    const body = JSON.stringify({
      fullname: randomString(10),
    });
    const params = {
      headers: { "Content-Type": "application/json" },
    };
    const response = http.post(url, body, params);
    check(response, {
      "status is OK": (res) => res.status === 200,
    });
    sleep(SLEEP_DURATION);
  });
}

/**
 * Teardown the Test
 */
export function teardown() {
  // 4. teardown code
}
