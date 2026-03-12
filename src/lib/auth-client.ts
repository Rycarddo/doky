import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: typeof window === "undefined" ? "http://localhost:3000" : undefined,
  plugins: [inferAdditionalFields<typeof auth>()],
});
