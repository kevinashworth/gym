import ky from "ky";

import { useAuthStore } from "@/store";
import { useDevStore } from "@/store";

import type { Hooks } from "ky";

// handle unique error messages from API
interface JsonResponse {
  errMsg?: string;
}

const prefixUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || "https://test.api.gotyou.co").trim();

const requiredHooks: Hooks = {
  beforeRequest: [
    (request) => {
      const token = useAuthStore.getState().token;
      if (token) {
        request.headers.set("Authorization", `Token ${token}`);
      }
    },
  ],
  afterResponse: [
    async (request, _options, response) => {
      if (!response.ok) {
        const json: JsonResponse = await response.json();
        if (json && json.errMsg) {
          throw new Error(json.errMsg);
        }
      }
    },
  ],
};

const consoleLogHooks: Hooks = {
  beforeRequest: [
    (request) => {
      const showApiConsoleLogs = useDevStore.getState().showApiConsoleLogs;
      if (showApiConsoleLogs) {
        if (request.method !== "GET") {
          console.group("API Request:");
          console.log(request.method, request.url);
          console.groupEnd();
        }
      }
    },
  ],
  afterResponse: [
    async (request, _options, response) => {
      const showApiConsoleLogs = useDevStore.getState().showApiConsoleLogs;
      if (showApiConsoleLogs) {
        const json = await response.json();
        const jsonString = JSON.stringify(json);
        const jsonFirst100CharsAsString =
          jsonString.length > 100 ? jsonString.slice(0, 100) + "..." : jsonString;
        console.group("API Response:");
        console.log(request.method, request.url);
        request.method === "GET" && console.log(response.status, jsonFirst100CharsAsString);
        console.groupEnd();
      }
    },
  ],
};

const apiWithRequiredChanges = ky.create({
  prefixUrl,
  hooks: requiredHooks,
});

const apiWithOptionalChanges = apiWithRequiredChanges.extend({
  hooks: consoleLogHooks,
});

const api =
  process.env.NODE_ENV === "development" ? apiWithOptionalChanges : apiWithRequiredChanges;

export default api;
