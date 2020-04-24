exports.onInitialClientRender = () => {
  var script = document.createElement("script");
  script.src = "/scripts/filters.js";
  document.body.appendChild(script);
};
