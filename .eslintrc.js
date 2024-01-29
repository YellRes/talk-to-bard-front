module.exports = {
  // Umi 项目
  extends: require.resolve("umi/eslint"),
  ignorePatterns: ["!.umirc.ts"],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
  },
};
