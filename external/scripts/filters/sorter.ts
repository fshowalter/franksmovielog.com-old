interface ISorter {
  sort(): void;
}

type ItemsBySortAttribute = Map<string, Item[]>;
type Item = { element: HTMLElement; sortValue: string };

(function initSorter(factory) {
  var sorterElement = document.querySelector<HTMLSelectElement>(
    "[data-sorter]"
  );

  if (!sorterElement) {
    return;
  }

  var sorter: ISorter;

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

        var options = [];
        for (var i = -1, len = selectInput.options.length; ++i !== len; ) {
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
        var parentNode = element.parentNode;
        var nextSibling = element.nextSibling;

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
        var parsedSortAttributeAndOrder = Sorter.parseSortAttributeAndOrder(
          sortAttributeAndOrder
        );

        var sortAttribute = parsedSortAttributeAndOrder[0];
        var sortOrder = parsedSortAttributeAndOrder[1];

        var sortFunction =
          sortOrder === "desc" ? Sorter.descendingSort : Sorter.ascendingSort;

        return this.itemsBySortAttribute.get(sortAttribute)!.sort(sortFunction);
      }

      mapValuesForElement(element: HTMLElement) {
        for (var i = 0, len = this.sortAttributes.length; i < len; i++) {
          var sortAttribute = this.sortAttributes[i];
          var sortValue =
            element.dataset[Sorter.camelCase(sortAttribute)] || "";

          var items = this.itemsBySortAttribute.get(sortAttribute);

          if (!items) {
            items = [];
            this.itemsBySortAttribute.set(sortAttribute, items);
          }

          items.push({
            element: element,
            sortValue: sortValue,
          });
        }
      }

      mapItems(items: NodeListOf<HTMLElement>) {
        for (var i = 0, len = items.length; i < len; i++) {
          var item = items[i];
          this.mapValuesForElement(item);
        }
      }

      sort() {
        var sortedItem;

        var reinsert = Sorter.removeElementToInsertLater(this.targetElement);

        this.targetElement.innerHTML = "";
        var sortedItems = this.sortListItems(this.selectInput.value);

        for (var i = 0, len = sortedItems.length; i < len; i++) {
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
