/* eslint-env browser */

exports.onInitialClientRender = () => {
  const toggleMenuScript = document.createElement("script");
  toggleMenuScript.src = "/scripts/toggleMenu.js";
  document.body.appendChild(toggleMenuScript);

  const filterScript = document.createElement("script");
  filterScript.src = "/scripts/filters.js";
  document.body.appendChild(filterScript);
};
