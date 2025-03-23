import ky from "ky";

import { useAuthStore } from "@/store";

// Add token to headers
const api = ky.extend({
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
