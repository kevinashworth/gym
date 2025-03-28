import ky from "ky";

import { useAuthStore } from "@/store";
import { useDevStore } from "@/store";

const prefixUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || "https://test.api.gotyou.co").trim();

const prefixed = ky.create({
  prefixUrl,
  hooks: {
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
  },
});

// Add token to headers
const api = prefixed.extend({
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set("X-Requested-With", "ky");
        const token = useAuthStore.getState().token;
        if (token) {
          request.headers.set("Authorization", `Token ${token}`);
        }
      },
    ],
  },
});

export default api;
