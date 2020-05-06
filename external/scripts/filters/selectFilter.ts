/* eslint-env node, browser */
/// <reference path="./filterExecutor.ts" />

(function initFilter(factory): void {
  const selectFilterElements = document.querySelectorAll<HTMLSelectElement>(
    '[data-filter-type="select"]'
  );

  const selectFilters = new WeakMap<HTMLSelectElement, Filter>();

  Array.prototype.forEach.call(
    selectFilterElements,
    function addEventListenersToNodeListItem(filterElement) {
      filterElement.addEventListener("change", function handleFilterChange(
        this: HTMLSelectElement,
        e: Event
      ) {
        e.preventDefault();

        const filter = selectFilters.get(this) || factory.create(this);

        selectFilters.set(this, filter);

        const event = new CustomEvent("filter-changed", {
          bubbles: true,
          cancelable: false,
          detail: filter,
        });

        this.dispatchEvent(event);
      });
    }
  );
})(
  (function buildSelectFilterFactory(): {
    create(element: HTMLElement): Filter;
  } {
    class SelectFilter implements Filter {
      readonly node: HTMLSelectElement;

      readonly attribute: string;

      constructor(node: HTMLSelectElement) {
        this.node = node;

        this.attribute =
          node.dataset.filterAttribute || SelectFilter.DEFAULTS.filterAttribute;
      }

      static DEFAULTS = {
        filterAttribute: "select",
      };

      getMatcher(): Matcher {
        const { attribute } = this;
        const value = this.node.selectedOptions[0].getAttribute("value");

        if (!value) {
          return function matcher(): boolean {
            return true;
          };
        }

        return function matcher(item: HTMLElement): boolean {
          return item.getAttribute(attribute) === value;
        };
      }
    }

    // Run the standard initializer
    function initialize(node: HTMLSelectElement): Filter {
      return new SelectFilter(node);
    }

    // Use an object instead of a function for future expansibility;
    return {
      create: initialize,
    };
  })()
);
