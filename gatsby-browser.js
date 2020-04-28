/* eslint-env browser */

exports.onInitialClientRender = () => {
  const script = document.createElement("script");
  script.src = "/scripts/filters.js";
  document.body.appendChild(script);
};
