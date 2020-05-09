"use strict";
(function initSearchToggle() {
  const toggleElements = document.querySelectorAll("[data-toggle]");
  function hide(menu, toggle) {
    console.log(menu);

    if (menu.classList.contains("js-toggle_off")) {
      return;
    }
    menu.classList.add("js-toggling", "js-toggle_off");
    menu.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-expanded", "false");
    const toggleAttribute = toggle;
    menu.addEventListener("transitionend", function handleTransitionEnd(event) {
      // if (event.propertyName === "height") {
      menu.removeEventListener("transitionend", handleTransitionEnd);
      this.classList.remove("js-toggling");
      // }
    });
  }
  function show(menu, toggle) {
    if (!menu.classList.contains("js-toggle_off")) {
      return;
    }
    menu.classList.add("js-toggling");
    menu.classList.remove("js-toggle_off");
    menu.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-expanded", "true");
    const toggleAttribute = toggle;
    menu.addEventListener("transitionend", function handleTransitionEnd(event) {
      if (event.propertyName === "opacity") {
        menu.removeEventListener("transitionend", handleTransitionEnd);
        this.classList.remove("js-toggling");
      }
    });
  }
  function handleSearchToggleClick() {
    const menuSelector = this.dataset.toggleTarget;
    if (!menuSelector) {
      return;
    }
    const menu = document.getElementById(menuSelector);

    if (!menu) {
      return;
    }
    if (menu.classList.contains("js-toggling")) {
      return;
    }
    if (menu.classList.contains("js-toggle_off")) {
      show(menu, this);
    } else {
      hide(menu, this);
    }
  }
  function addEventListenerToItemsInNodeList(list, event, fn) {
    Array.prototype.forEach.call(list, function addEventListenerToNodeListItem(
      item
    ) {
      item.addEventListener(event, fn, false);
    });
  }
  document.documentElement.classList.add("js-search");
  document.documentElement.addEventListener(
    "mousedown",
    function handleMouseDownToRemoveOutline() {
      return document.documentElement.classList.add("js-no_outline");
    }
  );
  document.documentElement.addEventListener(
    "keydown",
    function handleKeyDownToAddOutline() {
      return document.documentElement.classList.remove("js-no_outline");
    }
  );
  addEventListenerToItemsInNodeList(
    toggleElements,
    "click",
    handleSearchToggleClick
  );
})();
