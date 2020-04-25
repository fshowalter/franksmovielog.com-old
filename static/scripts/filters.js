"use strict";
(function initFilterer(factory) {
    var filterWrap = document.querySelector("[data-filter-controls]");
    if (!filterWrap) {
        return;
    }
    function underscoreDebounce(func, wait) {
        var args;
        var context;
        var result;
        var timeout = null;
        var timestamp = null;
        var later = function later() {
            var last = new Date().getTime() - timestamp.getTime();
            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            }
            else {
                timeout = null;
                result = func.apply(context, args);
                if (!timeout)
                    context = args = null;
            }
        };
        return function debouncedFunction() {
            args = arguments;
            timestamp = new Date();
            if (!timeout)
                timeout = setTimeout(later, wait);
            return result;
        };
    }
    var filterExecutor = null;
    filterWrap.addEventListener("filter-changed", function handleFilterChanged(e) {
        if (!filterExecutor) {
            filterExecutor = factory.create(this);
        }
        filterExecutor.addFilter(e.detail);
        underscoreDebounce(function debouncedFilter() {
            filterExecutor.filter();
        }, 50)();
    });
})((function buildFiltererFactory() {
    class FilterExecutor {
        constructor(node) {
            this.filters = new Map();
            this.itemsSelector =
                node.dataset.itemsSelector || FilterExecutor.DEFAULTS.itemsSelector;
            this.items = document.querySelectorAll(node.dataset.target + " " + this.itemsSelector);
        }
        static nodeListToArray(nodeList) {
            var array = [];
            var i;
            var len;
            for (i = -1, len = nodeList.length; ++i !== len;) {
                array[i] = nodeList[i];
            }
            return array;
        }
        static timedChunk(items, process) {
            var todo = FilterExecutor.nodeListToArray(items);
            var processItem = function processItemChunk() {
                var start = +new Date();
                do {
                    process.call(undefined, todo.shift());
                } while (todo.length > 0 && +new Date() - start < 50);
                if (todo.length > 0) {
                    return setTimeout(processItem, 25);
                }
            };
            return setTimeout(processItem, 25);
        }
        static getMatchers(filters) {
            var matcher;
            var matchers = [];
            filters.forEach((filter, _id) => {
                matcher = filter.getMatcher();
                if (matcher) {
                    matchers.push(matcher);
                }
            });
            return matchers;
        }
        addFilter(filter) {
            this.filters.set(filter.id, filter);
        }
        filter() {
            var matcher;
            var matchers = FilterExecutor.getMatchers(this.filters);
            function matchItem(item) {
                var i;
                var len;
                var match = true;
                for (i = 0, len = matchers.length; i < len; i++) {
                    matcher = matchers[i];
                    if (!matcher(item)) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    item.removeAttribute("style");
                }
                else {
                    item.style.display = "none";
                }
            }
            FilterExecutor.timedChunk(this.items, matchItem);
        }
    }
    FilterExecutor.DEFAULTS = {
        itemsSelector: "li",
    };
    function initialize(element) {
        return new FilterExecutor(element);
    }
    return {
        create: initialize,
    };
})());
(function initFilter(factory) {
    var textFilterElements = document.querySelectorAll('[data-filter-type="text"]');
    var textFilters = new Map();
    Array.prototype.forEach.call(textFilterElements, function addEventListenersToNodeListItem(filterElement) {
        filterElement.addEventListener("keyup", function handleTextFilterKeyUp() {
            var filter = textFilters.get(this.id) || factory.create(this);
            textFilters.set(this.id, filter);
            var event = new CustomEvent("filter-changed", {
                bubbles: true,
                cancelable: false,
                detail: filter,
            });
            this.dispatchEvent(event);
        });
    });
})((function buildTextFilterFactory() {
    class TextFilter {
        constructor(node) {
            this.node = node;
            if (!this.node.id) {
                this.node.setAttribute("id", this.uuidv4());
            }
            this.id = this.node.id;
            this.attribute =
                node.dataset.filterAttribute || TextFilter.DEFAULTS.filterAttribute;
        }
        static escapeRegExp(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
        uuidv4() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        }
        getMatcher() {
            var attribute = this.attribute;
            var value = this.node.value;
            var regex = new RegExp(TextFilter.escapeRegExp(value), "i");
            return function matcher(item) {
                if (!value) {
                    return true;
                }
                return regex.test(item.getAttribute(attribute) || "");
            };
        }
    }
    TextFilter.DEFAULTS = {
        filterAttribute: "text",
    };
    function initialize(element) {
        return new TextFilter(element);
    }
    return {
        create: initialize,
    };
})());
(function initSorter(factory) {
    var sorterElement = document.querySelector("[data-sorter]");
    if (!sorterElement) {
        return;
    }
    var sorter;
    sorterElement.addEventListener("change", function handleSorterChange(e) {
        e.preventDefault();
        sorter = sorter || factory.create(this);
        sorter.sort();
    });
})((function buildSorterFactory() {
    class Sorter {
        constructor(selectInput) {
            this.itemsBySortAttribute = new Map();
            this.selectInput = selectInput;
            this.targetElement = document.querySelector(this.selectInput.dataset.target);
            var options = [];
            for (var i = -1, len = selectInput.options.length; ++i !== len;) {
                options[i] = selectInput.options[i];
            }
            this.sortAttributes = options.map((option) => Sorter.parseSortAttributeAndOrder(option.value)[0]);
            this.mapItems(this.targetElement.querySelectorAll(Sorter.DEFAULTS.itemsSelector));
        }
        static descendingSort(a, b) {
            return -1 * Sorter.ascendingSort(a, b);
        }
        static ascendingSort(a, b) {
            return a.sortValue.localeCompare(b.sortValue);
        }
        static removeElementToInsertLater(element) {
            var parentNode = element.parentNode;
            var nextSibling = element.nextSibling;
            parentNode.removeChild(element);
            return function insertRemovedElement() {
                if (nextSibling) {
                    return parentNode.insertBefore(element, nextSibling);
                }
                return parentNode.appendChild(element);
            };
        }
        static camelCase(str) {
            return str.replace(/^([A-Z])|[\s-_](\w)/g, function handleCamelCaseRegexMatch(_match, p1, p2) {
                if (p2) {
                    return p2.toUpperCase();
                }
                return p1.toLowerCase();
            });
        }
        static parseSortAttributeAndOrder(sortAttributeAndOrder) {
            return /(.*)-(asc|desc)$/.exec(sortAttributeAndOrder).slice(1, 3);
        }
        sortListItems(sortAttributeAndOrder) {
            var parsedSortAttributeAndOrder = Sorter.parseSortAttributeAndOrder(sortAttributeAndOrder);
            var sortAttribute = parsedSortAttributeAndOrder[0];
            var sortOrder = parsedSortAttributeAndOrder[1];
            var sortFunction = sortOrder === "desc" ? Sorter.descendingSort : Sorter.ascendingSort;
            return this.itemsBySortAttribute.get(sortAttribute).sort(sortFunction);
        }
        mapValuesForElement(element) {
            for (var i = 0, len = this.sortAttributes.length; i < len; i++) {
                var sortAttribute = this.sortAttributes[i];
                var sortValue = element.dataset[Sorter.camelCase(sortAttribute)] || "";
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
        mapItems(items) {
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
    Sorter.DEFAULTS = {
        itemsSelector: "li",
    };
    function initialize(node) {
        return new Sorter(node);
    }
    return {
        create: initialize,
    };
})());
(function setFiltersFromQueryString() {
    function getQueryParameters() {
        var map = new Map();
        var query;
        var queryString = document.location.search;
        queryString
            .replace(/(^\?)/, "")
            .split("&")
            .map(function mapQueryString(q) {
            query = q.split("=");
            map.set(query[0], query[1]);
        });
        return map;
    }
    var params = getQueryParameters();
    for (var key in params) {
        if ({}.hasOwnProperty.call(params, key)) {
            var value = params.get(key);
            var filter = document.querySelector("[data-filter-attribute=data-" + key.toLowerCase() + "]");
            if (filter) {
                filter.value = decodeURI(value || "");
                var keyUpevent = document.createEvent("HTMLEvents");
                keyUpevent.initEvent("keyup", true, false);
                filter.dispatchEvent(keyUpevent);
            }
        }
    }
    document.documentElement.classList.add("js-filters");
})();
(function initFilter(factory) {
    var selectFilterElements = document.querySelectorAll('[data-filter-type="select"]');
    var selectFilters = new Map();
    Array.prototype.forEach.call(selectFilterElements, function addEventListenersToNodeListItem(filterElement) {
        filterElement.addEventListener("change", function handleFilterChange(e) {
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
    });
})((function buildSelectFilterFactory() {
    class SelectFilter {
        constructor(node) {
            this.node = node;
            if (!this.node.id) {
                this.node.setAttribute("id", this.uuidv4());
            }
            this.id = this.node.id;
            this.attribute =
                node.dataset.filterAttribute || SelectFilter.DEFAULTS.filterAttribute;
        }
        getMatcher() {
            var attribute = this.attribute;
            var value = this.node.value;
            return function matcher(item) {
                if (!value) {
                    return true;
                }
                return item.getAttribute(attribute) === value;
            };
        }
        uuidv4() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        }
    }
    SelectFilter.DEFAULTS = {
        filterAttribute: "select",
    };
    function initialize(node) {
        return new SelectFilter(node);
    }
    return {
        create: initialize,
    };
})());
