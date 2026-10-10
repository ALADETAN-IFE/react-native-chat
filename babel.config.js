// ============================================================
// REPOGUARD — MANUAL REVIEW REQUIRED: babel.config.js
// Scanned: 2026-10-10T05:19:24.493Z
// The following findings could NOT be automatically patched:
//   [MEDIUM] high-entropy-secret: High-entropy string detected — possible hardcoded credential or API key
// ============================================================

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "react" }]],
    plugins: ["react-native-worklets/plugin"],
  };
};
