import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/user", component: "user" },
  ],
  npmClient: "pnpm",
  extraPostCSSPlugins: [
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
});
