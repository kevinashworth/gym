import ky from "ky";

import { useAuthStore } from "@/store";
import { useDevStore } from "@/store";

const enableApiConsoleLogs = useDevStore.getState().enableApiConsoleLogs;

const prefixUrl = (
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://test.api.gotyou.co"
).trim();

const prefixed = ky.create({
  prefixUrl,
  hooks: {
    // beforeRequest: [
    //   (request) => {
    //     if (enableApiConsoleLogs) {
    //       console.group("API Request:");
    //       console.log(request.method, request.url);
    //       console.log({ headers: request.headers });
    //       console.groupEnd();
    //     }
    //   },
    // ],
    afterResponse: [
      async (request, _options, response) => {
        if (enableApiConsoleLogs) {
          const json = await response.json();
          const jsonString = JSON.stringify(json);
          const jsonFirst100CharsAsString =
            jsonString.length > 100
              ? jsonString.slice(0, 100) + "..."
              : jsonString;
          console.group("API Response:");
          console.log(request.method, request.url);
          request.method === "GET" &&
            console.log(response.status, jsonFirst100CharsAsString);
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
