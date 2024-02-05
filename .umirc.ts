import { defineConfig } from "umi";

export default defineConfig({
  npmClient: "pnpm",
  routes: [
    { path: "/", redirect: "/index" },
    { path: "/index", component: "@/pages/index" },
    { path: "/user", component: "@/pages/user" },
    { path: "/login", component: "@/pages/login", layout: false },
  ],

  plugins: [
    "@umijs/plugins/dist/request",
    "@umijs/plugins/dist/tailwindcss",
    "@umijs/plugins/dist/dva",
  ],
  // request 插件
  request: {
    dataField: "data",
  },
  extraPostCSSPlugins: [
    // px => vh工具
    require("postcss-px-to-viewport")({
      unitToConvert: "px",
      viewportWidth: 320,
      unitPrecision: 5,
      propList: ["*"],
      viewportUnit: "vw",
      fontViewportUnit: "vw",
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      exclude: [],
      landscape: false,
      landscapeUnit: "vw",
      landscapeWidth: 568,
    }),
  ],
  dva: {},
  // 环境变量
  define: {
    "process.env": {
      API_KEY: "AIzaSyCGXhcgB10pNS5pfGmCLHSlp1j06QzS1nI",
    },
  },
  tailwindcss: {},
});
