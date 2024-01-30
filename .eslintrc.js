module.exports = {
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
  },
  // Umi 项目
  extends: require.resolve("umi/eslint"),
  ignorePatterns: ["!.umirc.ts"],
};
