"use strict";
(function initFilterer(factory) {
  var filterWrap = document.querySelector("[data-filter-controls]");
  if (!filterWrap) {
    return;
  }
  function underscoreDebounce(func, wait) {
    var args;
    var context;
    var result;
    var timeout = null;
    var timestamp = null;
    var later = function later() {
      var last = new Date().getTime() - timestamp.getTime();
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    };
    return function debouncedFunction() {
      args = arguments;
      timestamp = new Date();
      if (!timeout) timeout = setTimeout(later, wait);
      return result;
    };
  }
  var filterExecutor = null;
  filterWrap.addEventListener("filter-changed", function handleFilterChanged(
    e
  ) {
    if (!filterExecutor) {
      filterExecutor = factory.create(this);
    }
    filterExecutor.addFilter(e.detail);
    underscoreDebounce(function debouncedFilter() {
      filterExecutor.filter();
    }, 50)();
  });
})(
  (function buildFiltererFactory() {
    class FilterExecutor {
      constructor(node) {
        this.filters = new Map();
        this.itemsSelector =
          node.dataset.itemsSelector || FilterExecutor.DEFAULTS.itemsSelector;
        this.items = document.querySelectorAll(
          node.dataset.target + " " + this.itemsSelector
        );
      }
      static nodeListToArray(nodeList) {
        var array = [];
        var i;
        var len;
        for (i = -1, len = nodeList.length; ++i !== len; ) {
          array[i] = nodeList[i];
        }
        return array;
      }
      /*
          Copyright 2009 Nicholas C. Zakas. All rights reserved. MIT Licensed
        */
      static timedChunk(items, process) {
        var todo = FilterExecutor.nodeListToArray(items);
        var processItem = function processItemChunk() {
          var start = +new Date();
          do {
            process.call(undefined, todo.shift());
          } while (todo.length > 0 && +new Date() - start < 50);
          if (todo.length > 0) {
            return setTimeout(processItem, 25);
          }
        };
        return setTimeout(processItem, 25);
      }
      static getMatchers(filters) {
        var matcher;
        var matchers = [];
        filters.forEach((filter, _id) => {
          matcher = filter.getMatcher();
          if (matcher) {
            matchers.push(matcher);
          }
        });
        return matchers;
      }
      addFilter(filter) {
        this.filters.set(filter.id, filter);
      }
      filter() {
        var matcher;
        var matchers = FilterExecutor.getMatchers(this.filters);
        function matchItem(item) {
          var i;
          var len;
          var match = true;
          for (i = 0, len = matchers.length; i < len; i++) {
            matcher = matchers[i];
            if (!matcher(item)) {
              match = false;
              break;
            }
          }
          if (match) {
            item.removeAttribute("style");
          } else {
            item.style.display = "none";
          }
        }
        FilterExecutor.timedChunk(this.items, matchItem);
      }
    }
    FilterExecutor.DEFAULTS = {
      itemsSelector: "li",
    };
    // Run the standard initializer
    function initialize(element) {
      return new FilterExecutor(element);
    }
    // Use an object instead of a function for future expansibility;
    return {
      create: initialize,
    };
  })()
);
/// <reference path="./filterExecutor.ts" />
(function initFilter(factory) {
  var textFilterElements = document.querySelectorAll(
    '[data-filter-type="text"]'
  );
  var textFilters = new Map();
  Array.prototype.forEach.call(
    textFilterElements,
    function addEventListenersToNodeListItem(filterElement) {
      filterElement.addEventListener("keyup", function handleTextFilterKeyUp() {
        var filter = textFilters.get(this.id) || factory.create(this);

        textFilters.set(this.id, filter);

        var event = new CustomEvent("filter-changed", {
          bubbles: true,
          cancelable: false,
          detail: filter,
        });
        this.dispatchEvent(event);
      });
    }
  );
})(
  (function buildTextFilterFactory() {
    class TextFilter {
      constructor(node) {
        this.node = node;
        if (!this.node.id) {
          this.node.setAttribute("id", this.uuidv4());
        }
        this.id = this.node.id;
        this.attribute =
          node.dataset.filterAttribute || TextFilter.DEFAULTS.filterAttribute;
      }
      static escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      }
      uuidv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            var r = (Math.random() * 16) | 0,
              v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
      }
      getMatcher() {
        var attribute = this.attribute;
        var value = this.node.value;
        var regex = new RegExp(TextFilter.escapeRegExp(value), "i");
        return function matcher(item) {
          if (!value) {
            return true;
          }
          return regex.test(item.getAttribute(attribute) || "");
        };
      }
    }
    TextFilter.DEFAULTS = {
      filterAttribute: "text",
    };
    // Run the standard initializer
    function initialize(element) {
      return new TextFilter(element);
    }
    // Use an object instead of a function for future expansibility;
    return {
      create: initialize,
    };
  })()
);
/// <reference path="./filterExecutor.ts" />
/// <reference path="./textFilter.ts" />
(function setFiltersFromQueryString() {
  function getQueryParameters() {
    var map = new Map();
    var query;
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
      var filter = document.querySelector(
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
