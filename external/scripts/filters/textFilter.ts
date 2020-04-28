/// <reference path="./filterExecutor.ts" />

(function initFilter(factory) {
  const textFilterElements = document.querySelectorAll<HTMLInputElement>(
    '[data-filter-type="text"]'
  );

  const textFilters = new WeakMap<HTMLElement, Filter>();

  Array.prototype.forEach.call(
    textFilterElements,
    function addEventListenersToNodeListItem(filterElement: HTMLInputElement) {
      filterElement.addEventListener("keyup", function handleTextFilterKeyUp(
        this: HTMLInputElement
      ) {
        const filter = textFilters.get(this) || factory.create(this);

        textFilters.set(this, filter);

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
  (function buildTextFilterFactory() {
    class TextFilter implements Filter {
      static DEFAULTS = {
        filterAttribute: "text",
      };

      static escapeRegExp(str: string) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      }

      readonly node: HTMLInputElement;

      readonly attribute: string;

      constructor(node: HTMLInputElement) {
        this.node = node;

        this.attribute =
          node.dataset.filterAttribute || TextFilter.DEFAULTS.filterAttribute;
      }

      getMatcher() {
        const {attribute} = this;
        const {value} = this.node;

        const regex = new RegExp(TextFilter.escapeRegExp(value), "i");

        return function matcher(item: HTMLElement) {
          if (!value) {
            return true;
          }

          return regex.test(item.getAttribute(attribute) || "");
        };
      }
    }

    // Run the standard initializer
    function initialize(element: HTMLInputElement) {
      return new TextFilter(element);
    }

    // Use an object instead of a function for future expansibility;
    return {
      create: initialize,
    };
  })()
);
