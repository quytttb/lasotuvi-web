import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import "fake-indexeddb/auto";
import { afterEach } from "vitest";

process.env.NEXT_PUBLIC_LASOTUVI_API_URL = "http://localhost:8000";
process.env.NEXT_PUBLIC_SITE_URL = "https://lasotuvi-web.vercel.app";

afterEach(() => {
  cleanup();
});
