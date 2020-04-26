/// <reference path="./nouislider-8.0.1.d.ts" />
/// <reference path="./nouislider-8.0.1.js" />
/// <reference path="./filterExecutor.ts" />

(function initRangeFilter(factory) {
  var rangeFilterElements = document.querySelectorAll<HTMLElement>(
    '[data-filter-type="range"]'
  );

  var rangeFilters = new WeakMap<HTMLElement, Filter>();

  function handleRangeFilterInit(this: HTMLElement, e: Event) {
    e.preventDefault();

    e.target!.removeEventListener(e.type, handleRangeFilterInit);

    var filter = rangeFilters.get(this);

    if (!filter) {
      filter = factory.create(this);
      rangeFilters.set(this, filter);
    }

    setTimeout(function redispatchMouseDownEvent() {
      e.target!.dispatchEvent(e);
    }, 10);
  }

  Array.prototype.forEach.call(
    rangeFilterElements,
    function addEventListenersToNodeListItem(filterElement) {
      Array.prototype.forEach.call(
        ["mousedown", "MSPointerDown", "touchstart"],
        function bindHandleRangeFilterInit(event) {
          filterElement.addEventListener(event, handleRangeFilterInit, false);
        }
      );

      filterElement.addEventListener(
        "keydown",
        function handleRangeFilterKeyDown(this: HTMLElement, e: KeyboardEvent) {
          if (e.which !== 9) {
            filterElement.removeEventListener(
              "keydown",
              handleRangeFilterKeyDown
            );

            var filter = rangeFilters.get(this);

            if (!filter) {
              filter = factory.create(this);
              rangeFilters.set(this, filter);
            }
          }
        }
      );
    }
  );
})(
  (function buildRangeFilterFactory() {
    class RangeFilter implements Filter {
      readonly element: HTMLElement;
      readonly options: {
        filterMinValue: number;
        filterMaxValue: number;
      };
      readonly attribute!: string;
      readonly sliderElement: noUiSlider.Instance;
      readonly minInputElement: HTMLInputElement;
      readonly maxInputElement: HTMLInputElement;

      constructor(element: HTMLElement) {
        this.element = element;
        this.options = {
          filterMinValue: parseInt(
            element.dataset.filterMinValue ||
              RangeFilter.DEFAULTS.filterMinValue,
            10
          ),
          filterMaxValue: parseInt(
            element.dataset.filterMaxValue ||
              RangeFilter.DEFAULTS.filterMaxValue,
            10
          ),
        };
        this.attribute =
          element.dataset.filterAttribute ||
          RangeFilter.DEFAULTS.filterAttribute;
        this.sliderElement = element.querySelector<HTMLElement>(
          ".noUiSlider"
        )! as noUiSlider.Instance;
        this.minInputElement = element.querySelector<HTMLInputElement>(
          ".filter-numeric.min"
        )!;
        this.maxInputElement = element.querySelector<HTMLInputElement>(
          ".filter-numeric.max"
        )!;

        this.initSlider();
      }

      static DEFAULTS = {
        filterAttribute: "text",
        filterMinValue: "1",
        filterMaxValue: "10",
      };

      initSlider() {
        if (this.sliderElement.noUiSlider) {
          return;
        }

        var element = this.element;
        var sliderElement = this.sliderElement;
        var minInputElement = this.minInputElement;
        var maxInputElement = this.maxInputElement;

        noUiSlider.create(sliderElement, {
          range: {
            min: this.options.filterMinValue,
            max: this.options.filterMaxValue,
          },
          start: [this.options.filterMinValue, this.options.filterMaxValue],
          step: 1,
          format: {
            to: function formatToValue(value: number) {
              return value;
            },
            from: function formatFromValue(value: number) {
              return value;
            },
          },
        });

        var filter = this;

        sliderElement.noUiSlider.on("set", function handleSliderSet() {
          var event = new CustomEvent("filter-changed", {
            bubbles: true,
            cancelable: false,
            detail: filter,
          });

          return element.dispatchEvent(event);
        });

        sliderElement.noUiSlider.on("update", function handleSliderUpdate(
          values: number[]
        ) {
          minInputElement.value = values[0].toString();
          maxInputElement.value = values[1].toString();
        });

        minInputElement.addEventListener(
          "change",
          function handleMinInputChange(this: HTMLInputElement) {
            sliderElement.noUiSlider.set([this.value, null]);
          }
        );

        maxInputElement.addEventListener(
          "change",
          function handleMinInputChange(this: HTMLInputElement) {
            sliderElement.noUiSlider.set([null, this.value]);
          }
        );
      }

      getMatcher() {
        var attribute = this.attribute;
        var range: number[] = this.sliderElement.noUiSlider.get() as number[];
        var filterMinValue = this.options.filterMinValue;
        var filterMaxValue = this.options.filterMaxValue;

        return function matcher(item: HTMLElement) {
          if (range[0] === filterMinValue && range[1] === filterMaxValue) {
            return true;
          }

          var value = parseInt(item.getAttribute(attribute)!, 10);
          return value >= range[0] && value <= range[1];
        };
      }
    }

    // Run the standard initializer
    function initialize(element: HTMLElement) {
      return new RangeFilter(element);
    }

    // Use an object instead of a function for future expansibility;
    return {
      create: initialize,
    };
  })()
);
