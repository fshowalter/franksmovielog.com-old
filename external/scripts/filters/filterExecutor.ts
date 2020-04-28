/* eslint-env node, browser */

interface FilterExecutor {
  addFilter(filter: Filter): void;
  filter(): void;
}

type Matcher = (item: HTMLElement) => boolean;

interface Filter {
  getMatcher(): Matcher;
}

(function initFilterer(factory): void {
  const filterWrap = document.querySelector<HTMLElement>(
    "[data-filter-controls]"
  );

  if (!filterWrap) {
    return;
  }

  function underscoreDebounce(func: Function, wait: number): () => void {
    let funcArgs: [] | null;
    let timeout: NodeJS.Timeout | null = null;
    let timestamp: Date | null = null;

    function later(): void {
      let last;

      if (timestamp) {
        last = new Date().getTime() - timestamp.getTime();
      }

      if (last && last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (funcArgs) {
          func(...funcArgs);
        } else {
          func();
        }
        if (!timeout) {
          funcArgs = null;
        }
      }
    }

    return function debouncedFunction(...args): void {
      funcArgs = args;
      timestamp = new Date();

      if (!timeout) timeout = setTimeout(later, wait);
    };
  }

  let filterExecutor: FilterExecutor | null = null;

  filterWrap.addEventListener("filter-changed", function handleFilterChanged(
    this: HTMLElement,
    e
  ) {
    if (!filterExecutor) {
      filterExecutor = factory.create(this);
    }

    filterExecutor.addFilter((e as CustomEvent).detail as Filter);

    underscoreDebounce(() => {
      if (filterExecutor) {
        filterExecutor.filter();
      }
    }, 50)();
  });
})(
  (function buildFiltererFactory(): {
    create(element: HTMLElement): FilterExecutor;
  } {
    class FilterExecutorImpl implements FilterExecutor {
      static DEFAULTS = {
        itemsSelector: "li",
      };

      static nodeListToArray(nodeList: NodeList): Node[] {
        const array = [];

        for (let i = -1, len = nodeList.length; i < len; i += 1) {
          array[i] = nodeList[i];
        }

        return array;
      }

      /*
        Copyright 2009 Nicholas C. Zakas. All rights reserved. MIT Licensed
      */
      static timedChunk(items: NodeList, process: Function): NodeJS.Timeout {
        const todo = FilterExecutorImpl.nodeListToArray(items);
        function processItem(): NodeJS.Timeout | null {
          const start = +new Date();

          do {
            process.call(undefined, todo.shift());
          } while (todo.length > 0 && +new Date() - start < 50);

          if (todo.length > 0) {
            return setTimeout(processItem, 25);
          }

          return null;
        }

        return setTimeout(processItem, 25);
      }

      static getMatchers(filters: Set<Filter>): Matcher[] {
        let matcher: Matcher;
        const matchers: Matcher[] = [];

        filters.forEach((filter: Filter) => {
          matcher = filter.getMatcher();

          if (matcher) {
            matchers.push(matcher);
          }
        });

        return matchers;
      }

      itemsSelector: string;

      items: NodeListOf<HTMLElement>;

      filters: Set<Filter> = new Set<Filter>();

      constructor(node: HTMLElement) {
        this.itemsSelector =
          node.dataset.itemsSelector ||
          FilterExecutorImpl.DEFAULTS.itemsSelector;
        this.items = document.querySelectorAll<HTMLElement>(
          `${node.dataset.target} ${this.itemsSelector}`
        );
      }

      addFilter(filter: Filter): void {
        this.filters.add(filter);
      }

      filter(): void {
        let matcher;
        const matchers = FilterExecutorImpl.getMatchers(this.filters);

        function matchItem(item: HTMLElement): void {
          let match = true;

          for (let i = 0, len = matchers.length; i < len; i += 1) {
            matcher = matchers[i];
            if (!matcher(item)) {
              match = false;
              break;
            }
          }
          if (match) {
            item.removeAttribute("style");
          } else {
            item.style.display = "none"; // eslint-disable-line no-param-reassign
          }
        }

        FilterExecutorImpl.timedChunk(this.items, matchItem);
      }
    }

    // Run the standard initializer
    function initialize(element: HTMLElement): FilterExecutor {
      return new FilterExecutorImpl(element);
    }

    // Use an object instead of a function for future expansibility;
    return {
      create: initialize,
    };
  })()
);
