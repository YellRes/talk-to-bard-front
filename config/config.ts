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
      target: "http://120.27.131.228:3000/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
    "/qWenApi": {
      target: "https://dashscope.aliyuncs.com/",
      changeOrigin: true,
      pathRewrite: { "^/qWenApi": "/api" },
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
  esbuildMinifyIIFE: true,

  define: {
    "process.env": {
      API_KEY_GEMINI: "AIzaSyBuhdie0c1SSe2MeRaYV75S94aDwKV64P8",
      APP_ID_SPARK: "26af466f",
      API_SECRET_SPARK: "NDIxODhiMzUyYzE0YzhkYzI0NjUxY2Q1",
      API_KEY_SPARK: "8ac111ba902c1ce3b10ee3c1cc3b9ffd",
      API_KEY_QWEN: "sk-64fe5d7794774632a0501292632d1395",
    },
  },
  dva: {},
  model: {},
  initialState: {},
  tailwindcss: {},
});
