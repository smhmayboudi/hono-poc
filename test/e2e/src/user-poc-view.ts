import {
  randomIntBetween,
  randomString,
  // @ts-ignore
} from "https://jslib.k6.io/k6-utils/1.6.0/index.js";
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
  group("/user-poc-view:post", () => {
    const url = `${BASE_URL}/user-poc-view`;
    const body = JSON.stringify({
      address: randomString(10),
      age: randomIntBetween(0, 10),
      fullname: randomString(10),
    });
    const params = { headers: { "Content-Type": "application/json" } };
    const response = http.post(url, body, params);
    check(response, { "status is OK": (res) => res.status === 201 });
    sleep(SLEEP_DURATION);
  });
  group("/user-poc-view:get", () => {
    const url = `${BASE_URL}/user-poc-view`;
    const params = { headers: { "Content-Type": "application/json" } };
    const response = http.get(url, params);
    check(response, { "status is OK": (res) => res.status === 200 });
    sleep(SLEEP_DURATION);
  });
  group("/user-poc-view:del", () => {
    const id = 1234567890;
    const url = `${BASE_URL}/user-poc-view/${id}`;
    const body = JSON.stringify({});
    const params = { headers: { "Content-Type": "application/json" } };
    const response = http.del(url, body, params);
    check(response, { "status is OK": (res) => res.status === 200 });
    sleep(SLEEP_DURATION);
  });
  group("/user-poc-view/:id:get", () => {
    const id = 1234567890;
    const url = `${BASE_URL}/user-poc-view/${id}`;
    const params = { headers: { "Content-Type": "application/json" } };
    const response = http.get(url, params);
    check(response, { "status is OK": (res) => res.status === 200 });
    sleep(SLEEP_DURATION);
  });
  group("/user-poc-view:patch", () => {
    const id = 1234567890;
    const url = `${BASE_URL}/user-poc-view/${id}`;
    const body = JSON.stringify({
      address: randomString(10),
      age: randomIntBetween(0, 10),
      fullname: randomString(10),
    });
    const params = { headers: { "Content-Type": "application/json" } };
    const response = http.patch(url, body, params);
    check(response, { "status is OK": (res) => res.status === 200 });
    sleep(SLEEP_DURATION);
  });
  group("/user-poc-view/search:post", () => {
    const url = `${BASE_URL}/user-poc-view`;
    const body = JSON.stringify({ query: randomString(10) });
    const params = { headers: { "Content-Type": "application/json" } };
    const response = http.post(url, body, params);
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
