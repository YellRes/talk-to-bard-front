import { defineConfig } from "umi";
import path from "path";

export default defineConfig({
  npmClient: "pnpm",
  routes: [
    { path: "/", redirect: "/index" },
    { path: "/index", component: "index" },
    { path: "/user", component: "user" },
  ],
  plugins: ["@umijs/plugins/dist/request"],
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
  chainWebpack(config: any) {
    // 用svg-sprite-loader制作 svg-symbol，让我们可以直接使用 svg-use。
    config.module
      .rule("svg")
      .exclude.add(path.resolve(__dirname, "./src/assets/svg")) // 排除icons目录
      .end();

    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/i)
      .include.add(path.resolve(__dirname, "./src/assets/svg"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader");
  },
  // 环境变量
  define: {
    "process.env": {
      API_KEY: "AIzaSyCGXhcgB10pNS5pfGmCLHSlp1j06QzS1nI",
    },
  },
});
