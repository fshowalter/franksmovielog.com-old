/* eslint-env node, browser */
/// <reference path="./nouislider-8.0.1.d.ts" />
/// <reference path="./nouislider-8.0.1.js" />
/// <reference path="./filterExecutor.ts" />

(function initRangeFilter(factory): void {
  const rangeFilterElements = document.querySelectorAll<HTMLElement>(
    '[data-filter-type="range"]'
  );

  const rangeFilters = new WeakMap<HTMLElement, Filter>();

  function handleRangeFilterInit(this: HTMLElement, e: Event): void {
    if (!e.target) {
      return;
    }

    e.preventDefault();

    e.target.removeEventListener(e.type, handleRangeFilterInit);

    let filter = rangeFilters.get(this);

    if (!filter) {
      filter = factory.create(this);
      rangeFilters.set(this, filter);
    }

    setTimeout(function redispatchMouseDownEvent() {
      if (e.target) {
        e.target.dispatchEvent(e);
      }
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

            let filter = rangeFilters.get(this);

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
  (function buildRangeFilterFactory(): {
    create(element: HTMLElement): Filter;
  } {
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
        ) as noUiSlider.Instance;
        const minInputElement = element.querySelector<HTMLInputElement>(
          ".filter-numeric.min"
        );

        if (!minInputElement) {
          throw new Error("minInputElement not found");
        }

        this.minInputElement = minInputElement;

        const maxInputElement = element.querySelector<HTMLInputElement>(
          ".filter-numeric.max"
        );

        if (!maxInputElement) {
          throw new Error("maxInputElement not found");
        }

        this.maxInputElement = maxInputElement;

        this.initSlider();
      }

      static DEFAULTS = {
        filterAttribute: "text",
        filterMinValue: "1",
        filterMaxValue: "10",
      };

      initSlider(): void {
        if (this.sliderElement.noUiSlider) {
          return;
        }

        const { element } = this;
        const { sliderElement } = this;
        const { minInputElement } = this;
        const { maxInputElement } = this;

        window.noUiSlider.create(sliderElement, {
          range: {
            min: this.options.filterMinValue,
            max: this.options.filterMaxValue,
          },
          start: [this.options.filterMinValue, this.options.filterMaxValue],
          step: 1,
          format: {
            to: function formatToValue(value: number): number {
              return value;
            },
            from: function formatFromValue(value: number): number {
              return value;
            },
          },
        });

        sliderElement.noUiSlider.on("set", () => {
          const event = new CustomEvent("filter-changed", {
            bubbles: true,
            cancelable: false,
            detail: this,
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

      getMatcher(): (element: HTMLElement) => boolean {
        const { attribute } = this;
        const range: number[] = this.sliderElement.noUiSlider.get() as number[];
        const { filterMinValue } = this.options;
        const { filterMaxValue } = this.options;

        return function matcher(item: HTMLElement): boolean {
          if (range[0] === filterMinValue && range[1] === filterMaxValue) {
            return true;
          }

          const value = parseInt(item.getAttribute(attribute) || "", 10);
          return value >= range[0] && value <= range[1];
        };
      }
    }

    // Run the standard initializer
    function initialize(element: HTMLElement): Filter {
      return new RangeFilter(element);
    }

    // Use an object instead of a function for future expansibility;
    return {
      create: initialize,
    };
  })()
);
