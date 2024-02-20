import { defineConfig } from "umi";

export default defineConfig({
  npmClient: "pnpm",
  routes: [
    { path: "/", redirect: "/index" },
    { path: "/index", component: "@/pages/index" },
    { path: "/user", component: "@/pages/user" },
    { path: "/register", component: "@/pages/register", layout: false },
    { path: "/login", component: "@/pages/login", layout: false },
    { path: "/edit", component: "@/pages/edit", layout: false },
  ],

  // proxy
  proxy: {
    "/api": {
      target: "http://192.168.19.133:3000/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
  },

  plugins: [
    "@umijs/plugins/dist/request",
    "@umijs/plugins/dist/tailwindcss",
    "@umijs/plugins/dist/dva",
    "@umijs/plugins/dist/initial-state",
    "@umijs/plugins/dist/model",
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

  define: {
    "process.env": {
      API_KEY: "AIzaSyCGXhcgB10pNS5pfGmCLHSlp1j06QzS1nI",
    },
  },
  dva: {},
  model: {},
  initialState: {},
  tailwindcss: {},
});
