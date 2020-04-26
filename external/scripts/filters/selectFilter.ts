/// <reference path="./filterExecutor.ts" />

(function initFilter(factory) {
  var selectFilterElements = document.querySelectorAll<HTMLInputElement>(
    '[data-filter-type="select"]'
  );

  var selectFilters = new WeakMap<HTMLElement, Filter>();

  Array.prototype.forEach.call(
    selectFilterElements,
    function addEventListenersToNodeListItem(filterElement) {
      filterElement.addEventListener("change", function handleFilterChange(
        this: HTMLInputElement,
        e: Event
      ) {
        e.preventDefault();

        var filter = selectFilters.get(this) || factory.create(this);

        selectFilters.set(this, filter);

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
  (function buildSelectFilterFactory() {
    class SelectFilter implements Filter {
      readonly node: HTMLInputElement;
      readonly attribute: string;

      constructor(node: HTMLInputElement) {
        this.node = node;

        this.attribute =
          node.dataset.filterAttribute || SelectFilter.DEFAULTS.filterAttribute;
      }

      static DEFAULTS = {
        filterAttribute: "select",
      };

      getMatcher() {
        var attribute = this.attribute;
        var value = this.node.value;

        return function matcher(item: HTMLElement) {
          if (!value) {
            return true;
          }

          return item.getAttribute(attribute) === value;
        };
      }
    }

    // Run the standard initializer
    function initialize(node: HTMLInputElement) {
      return new SelectFilter(node);
    }

    // Use an object instead of a function for future expansibility;
    return {
      create: initialize,
    };
  })()
);
