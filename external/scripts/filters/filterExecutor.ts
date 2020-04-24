interface IFilterExecutor {
  addFilter(filter: Filter): void;
  filter(): void;
}

type Matcher = (item: HTMLElement) => boolean;

interface Filter {
  id: string;
  getMatcher(): Matcher;
}

(function initFilterer(factory) {
  var filterWrap = document.querySelector<HTMLElement>(
    "[data-filter-controls]"
  );

  if (!filterWrap) {
    return;
  }

  function underscoreDebounce(func: Function, wait: number) {
    var args: any;
    var context: any;
    var result: any;
    var timeout: NodeJS.Timeout | null = null;
    var timestamp: Date | null = null;

    var later = function later() {
      var last = new Date().getTime() - timestamp!.getTime();

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

  var filterExecutor: IFilterExecutor | null = null;

  filterWrap.addEventListener("filter-changed", function handleFilterChanged(
    this: HTMLElement,
    e
  ) {
    if (!filterExecutor) {
      filterExecutor = factory.create(this);
    }

    filterExecutor.addFilter((e as CustomEvent).detail as Filter);

    underscoreDebounce(function debouncedFilter() {
      filterExecutor!.filter();
    }, 50)();
  });
})(
  (function buildFiltererFactory() {
    class FilterExecutor implements IFilterExecutor {
      static DEFAULTS = {
        itemsSelector: "li",
      };

      static nodeListToArray(nodeList: NodeList) {
        var array = [];
        var i: number;
        var len: number;

        for (i = -1, len = nodeList.length; ++i !== len; ) {
          array[i] = nodeList[i];
        }

        return array;
      }

      /*
        Copyright 2009 Nicholas C. Zakas. All rights reserved. MIT Licensed
      */
      static timedChunk(items: NodeList, process: Function) {
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

      static getMatchers(filters: Map<string, Filter>) {
        var matcher: Matcher;
        var matchers: Matcher[] = [];

        filters.forEach((filter: Filter, _id: string) => {
          matcher = filter.getMatcher();

          if (matcher) {
            matchers.push(matcher);
          }
        });

        return matchers;
      }

      itemsSelector: string;
      items: NodeListOf<HTMLElement>;
      filters: Map<string, Filter> = new Map<string, Filter>();

      constructor(node: HTMLElement) {
        this.itemsSelector =
          node.dataset.itemsSelector || FilterExecutor.DEFAULTS.itemsSelector;
        this.items = document.querySelectorAll<HTMLElement>(
          node.dataset.target + " " + this.itemsSelector
        );
      }

      addFilter(filter: Filter) {
        this.filters.set(filter.id, filter);
      }

      filter() {
        var matcher;
        var matchers = FilterExecutor.getMatchers(this.filters);

        function matchItem(item: HTMLElement) {
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

    // Run the standard initializer
    function initialize(element: HTMLElement) {
      return new FilterExecutor(element);
    }

    // Use an object instead of a function for future expansibility;
    return {
      create: initialize,
    };
  })()
);
