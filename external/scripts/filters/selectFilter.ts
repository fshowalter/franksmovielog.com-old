/// <reference path="./filterExecutor.ts" />

(function initFilter(factory) {
  var selectFilterElements = document.querySelectorAll<HTMLInputElement>(
    '[data-filter-type="select"]'
  );

  var selectFilters = new Map<string, Filter>();

  Array.prototype.forEach.call(
    selectFilterElements,
    function addEventListenersToNodeListItem(filterElement) {
      filterElement.addEventListener("change", function handleFilterChange(
        this: HTMLInputElement,
        e: Event
      ) {
        e.preventDefault();

        var filter = selectFilters.get(this.id) || factory.create(this);

        selectFilters.set(this.id, filter);

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
      readonly id: string;

      constructor(node: HTMLInputElement) {
        this.node = node;

        if (!this.node.id) {
          this.node.setAttribute("id", this.uuidv4());
        }

        this.id = this.node.id;

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
