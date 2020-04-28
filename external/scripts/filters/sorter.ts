/* eslint-env node, browser */

interface Sorter {
  sort(): void;
}

type ItemsBySortAttribute = Map<string, Item[]>;
type Item = { element: HTMLElement; sortValue: string };

(function initSorter(factory): void {
  const sorterElement = document.querySelector<HTMLSelectElement>(
    "[data-sorter]"
  );

  if (!sorterElement) {
    return;
  }

  let sorter: Sorter;

  sorterElement.addEventListener("change", function handleSorterChange(
    this: HTMLSelectElement,
    e: Event
  ) {
    e.preventDefault();

    sorter = sorter || factory.create(this);

    sorter.sort();
  });
})(
  (function buildSorterFactory(): {
    create(element: HTMLSelectElement): Sorter;
  } {
    class SorterImpl implements Sorter {
      readonly targetElement: HTMLElement;

      readonly itemsBySortAttribute: ItemsBySortAttribute = new Map<
        string,
        { element: HTMLElement; sortValue: string }[]
      >();

      readonly sortAttributes: string[];

      readonly selectInput: HTMLSelectElement;

      constructor(selectInput: HTMLSelectElement) {
        this.selectInput = selectInput;
        const {
          dataset: { target: targetSelector },
        } = this.selectInput;

        if (!targetSelector) {
          throw new Error("data-target property not found on selectInput");
        }

        const targetElement = document.querySelector<HTMLElement>(
          targetSelector
        );

        if (!targetElement) {
          throw new Error("targetElement not found");
        }

        this.targetElement = targetElement;

        const options = [];
        for (let i = -1, len = selectInput.options.length; i < len; i += 1) {
          options[i] = selectInput.options[i];
        }

        this.sortAttributes = options.map(
          (option) => SorterImpl.parseSortAttributeAndOrder(option.value)[0]
        );

        this.mapItems(
          this.targetElement.querySelectorAll(SorterImpl.DEFAULTS.itemsSelector)
        );
      }

      static DEFAULTS = {
        itemsSelector: "li",
      };

      static descendingSort(a: Item, b: Item): number {
        return -1 * SorterImpl.ascendingSort(a, b);
      }

      static ascendingSort(a: Item, b: Item): number {
        return a.sortValue.localeCompare(b.sortValue);
      }

      static removeElementToInsertLater(
        element: HTMLElement
      ): () => HTMLElement {
        const { parentNode } = element;
        const { nextSibling } = element;

        if (!parentNode) {
          throw new Error("parentNode not found");
        }

        parentNode.removeChild(element);

        return function insertRemovedElement(): HTMLElement {
          if (nextSibling) {
            return parentNode.insertBefore(element, nextSibling);
          }

          return parentNode.appendChild(element);
        };
      }

      static camelCase(str: string): string {
        return str.replace(
          /^([A-Z])|[\s-_](\w)/g,
          function handleCamelCaseRegexMatch(_match, p1, p2) {
            if (p2) {
              return p2.toUpperCase();
            }
            return p1.toLowerCase();
          }
        );
      }

      static parseSortAttributeAndOrder(
        sortAttributeAndOrder: string
      ): string[] {
        return (
          /(.*)-(asc|desc)$/.exec(sortAttributeAndOrder)?.slice(1, 3) || []
        );
      }

      sortListItems(sortAttributeAndOrder: string): Item[] {
        const parsedSortAttributeAndOrder = SorterImpl.parseSortAttributeAndOrder(
          sortAttributeAndOrder
        );

        const sortAttribute = parsedSortAttributeAndOrder[0];
        const sortOrder = parsedSortAttributeAndOrder[1];

        const sortFunction =
          sortOrder === "desc"
            ? SorterImpl.descendingSort
            : SorterImpl.ascendingSort;

        return (
          this.itemsBySortAttribute.get(sortAttribute)?.sort(sortFunction) || []
        );
      }

      mapValuesForElement(element: HTMLElement): void {
        for (let i = 0, len = this.sortAttributes.length; i < len; i += 1) {
          const sortAttribute = this.sortAttributes[i];
          const sortValue =
            element.dataset[SorterImpl.camelCase(sortAttribute)] || "";

          let items = this.itemsBySortAttribute.get(sortAttribute);

          if (!items) {
            items = [];
            this.itemsBySortAttribute.set(sortAttribute, items);
          }

          items.push({
            element,
            sortValue,
          });
        }
      }

      mapItems(items: NodeListOf<HTMLElement>): void {
        for (let i = 0, len = items.length; i < len; i += 1) {
          const item = items[i];
          this.mapValuesForElement(item);
        }
      }

      sort(): HTMLElement {
        let sortedItem;

        const reinsert = SorterImpl.removeElementToInsertLater(
          this.targetElement
        );

        this.targetElement.innerHTML = "";
        const sortedItems = this.sortListItems(this.selectInput.value);

        for (let i = 0, len = sortedItems.length; i < len; i += 1) {
          sortedItem = sortedItems[i];
          this.targetElement.appendChild(sortedItem.element);
        }

        return reinsert();
      }
    }

    // Run the standard initializer
    function initialize(node: HTMLSelectElement): Sorter {
      return new SorterImpl(node);
    }

    // Use an object instead of a function for future expansibility;
    return {
      create: initialize,
    };
  })()
);
