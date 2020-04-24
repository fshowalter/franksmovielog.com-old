/// <reference path="./filterExecutor.ts" />

(function initFilter(factory) {
  var textFilterElements = document.querySelectorAll<HTMLInputElement>(
    '[data-filter-type="text"]'
  );

  var textFilters = new Map<string, Filter>();

  Array.prototype.forEach.call(
    textFilterElements,
    function addEventListenersToNodeListItem(filterElement: HTMLInputElement) {
      filterElement.addEventListener("keyup", function handleTextFilterKeyUp(
        this: HTMLInputElement
      ) {
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
    class TextFilter implements Filter {
      static DEFAULTS = {
        filterAttribute: "text",
      };

      static escapeRegExp(str: string) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      }

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
          node.dataset.filterAttribute || TextFilter.DEFAULTS.filterAttribute;
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
