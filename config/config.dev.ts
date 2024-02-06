import { defineConfig } from "umi";

export default defineConfig({
  define: {
    "process.env": {
      SERVER_URL: "http://192.168.19.133:3000",
    },
  },
});
