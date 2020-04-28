/* eslint-env node, browser */

interface ISorter {
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

  let sorter: ISorter;

  sorterElement.addEventListener("change", function handleSorterChange(
    this: HTMLSelectElement,
    e: Event
  ) {
    e.preventDefault();

    sorter = sorter || factory.create(this);

    sorter.sort();
  });
})(
  (function buildSorterFactory() {
    class Sorter implements ISorter {
      readonly targetElement: HTMLElement;

      readonly itemsBySortAttribute: ItemsBySortAttribute = new Map<
        string,
        { element: HTMLElement; sortValue: string }[]
      >();

      readonly sortAttributes: string[];

      readonly selectInput: HTMLSelectElement;

      constructor(selectInput: HTMLSelectElement) {
        this.selectInput = selectInput;
        this.targetElement = document.querySelector<HTMLElement>(
          this.selectInput.dataset.target!
        )!;

        const options = [];
        for (let i = -1, len = selectInput.options.length; ++i !== len; ) {
          options[i] = selectInput.options[i];
        }

        this.sortAttributes = options.map(
          (option) => Sorter.parseSortAttributeAndOrder(option.value)[0]
        );

        this.mapItems(
          this.targetElement.querySelectorAll(Sorter.DEFAULTS.itemsSelector)
        );
      }

      static DEFAULTS = {
        itemsSelector: "li",
      };

      static descendingSort(a: Item, b: Item) {
        return -1 * Sorter.ascendingSort(a, b);
      }

      static ascendingSort(a: Item, b: Item) {
        return a.sortValue.localeCompare(b.sortValue);
      }

      static removeElementToInsertLater(element: HTMLElement) {
        const { parentNode } = element;
        const { nextSibling } = element;

        parentNode!.removeChild(element);

        return function insertRemovedElement() {
          if (nextSibling) {
            return parentNode!.insertBefore(element, nextSibling);
          }

          return parentNode!.appendChild(element);
        };
      }

      static camelCase(str: string) {
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

      static parseSortAttributeAndOrder(sortAttributeAndOrder: string) {
        return /(.*)-(asc|desc)$/.exec(sortAttributeAndOrder)!.slice(1, 3);
      }

      sortListItems(sortAttributeAndOrder: string) {
        const parsedSortAttributeAndOrder = Sorter.parseSortAttributeAndOrder(
          sortAttributeAndOrder
        );

        const sortAttribute = parsedSortAttributeAndOrder[0];
        const sortOrder = parsedSortAttributeAndOrder[1];

        const sortFunction =
          sortOrder === "desc" ? Sorter.descendingSort : Sorter.ascendingSort;

        return this.itemsBySortAttribute.get(sortAttribute)!.sort(sortFunction);
      }

      mapValuesForElement(element: HTMLElement) {
        for (let i = 0, len = this.sortAttributes.length; i < len; i++) {
          const sortAttribute = this.sortAttributes[i];
          const sortValue =
            element.dataset[Sorter.camelCase(sortAttribute)] || "";

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

      mapItems(items: NodeListOf<HTMLElement>) {
        for (let i = 0, len = items.length; i < len; i++) {
          const item = items[i];
          this.mapValuesForElement(item);
        }
      }

      sort() {
        let sortedItem;

        const reinsert = Sorter.removeElementToInsertLater(this.targetElement);

        this.targetElement.innerHTML = "";
        const sortedItems = this.sortListItems(this.selectInput.value);

        for (let i = 0, len = sortedItems.length; i < len; i++) {
          sortedItem = sortedItems[i];
          this.targetElement.appendChild(sortedItem.element);
        }

        return reinsert();
      }
    }

    // Run the standard initializer
    function initialize(node: HTMLSelectElement) {
      return new Sorter(node);
    }

    // Use an object instead of a function for future expansibility;
    return {
      create: initialize,
    };
  })()
);
