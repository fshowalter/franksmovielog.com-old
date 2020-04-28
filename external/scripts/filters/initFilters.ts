/* eslint-env node, browser */

/// <reference path="./filterExecutor.ts" />
/// <reference path="./textFilter.ts" />
/// <reference path="./sorter.ts" />

(function setFiltersFromQueryString(): void {
  function getQueryParameters(): Map<string, string> {
    const map = new Map<string, string>();
    let query: string[];
    const queryString = document.location.search;

    queryString
      .replace(/(^\?)/, "")
      .split("&")
      .forEach(function mapQueryString(q): void {
        query = q.split("=");
        map.set(query[0], query[1]);
      });

    return map;
  }

  const params = getQueryParameters();

  Object.keys(params).forEach((key) => {
    const value = params.get(key);
    const filter = document.querySelector<HTMLInputElement>(
      `[data-filter-attribute=data-${key.toLowerCase()}]`
    );

    if (filter) {
      filter.value = decodeURI(value || "");

      const keyUpevent = document.createEvent("HTMLEvents");
      keyUpevent.initEvent("keyup", true, false);
      filter.dispatchEvent(keyUpevent);
    }
  });

  document.documentElement.classList.add("js-filters");
})();
