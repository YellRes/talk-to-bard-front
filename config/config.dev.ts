import { defineConfig } from "umi";

export default defineConfig({
  define: {
    "process.env": {
      SERVER_URL: "http://localhost:3000",
    },
  },
});
