/// <reference path="./filterExecutor.ts" />
/// <reference path="./textFilter.ts" />
/// <reference path="./sorter.ts" />

(function setFiltersFromQueryString() {
  function getQueryParameters() {
    var map = new Map<string, string>();
    var query: string[];
    var queryString = document.location.search;

    queryString
      .replace(/(^\?)/, "")
      .split("&")
      .map(function mapQueryString(q) {
        query = q.split("=");
        map.set(query[0], query[1]);
      });

    return map;
  }

  var params = getQueryParameters();

  for (var key in params) {
    if ({}.hasOwnProperty.call(params, key)) {
      var value = params.get(key);
      var filter = document.querySelector<HTMLInputElement>(
        "[data-filter-attribute=data-" + key.toLowerCase() + "]"
      );

      if (filter) {
        filter.value = decodeURI(value || "");

        var keyUpevent = document.createEvent("HTMLEvents");
        keyUpevent.initEvent("keyup", true, false);
        filter.dispatchEvent(keyUpevent);
      }
    }
  }
  document.documentElement.classList.add("js-filters");
})();
