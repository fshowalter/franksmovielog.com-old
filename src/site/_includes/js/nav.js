(function initNav() {
  "use strict";
  const topBar = document.querySelector("[data-responsive-hidden-nav]");
  const button = document.querySelector(
    "[data-responsive-hidden-nav] > button"
  );
  const list = document.querySelector("[data-responsive-hidden-nav] ul");

  const responsiveBreaks = []; // Empty List (Array) on initialization

  function getWidth(element) {
    return parseFloat(getComputedStyle(element, null).width.replace("px", ""));
  }

  function getVisibleLinks() {
    return document.querySelectorAll(
      "[data-responsive-hidden-nav] li:not(.hidden)"
    );
  }

  function getHiddenLinks() {
    return document.querySelectorAll("[data-responsive-hidden-nav] li.hidden");
  }

  function updateTopBar() {
    var availableSpace = button.classList.contains("hidden")
      ? getWidth(topBar)
      : getWidth(topBar) - getWidth(button) - 30; // Calculation of available space on the logic of whether button has the class `hidden` or not

    if (getWidth(list) > availableSpace) {
      // Logic when visible list is overflowing the nav

      responsiveBreaks.push(getWidth(list)); // Record the width of the list

      const visibleLinks = getVisibleLinks();

      visibleLinks[visibleLinks.length - 1].classList.add("hidden");

      // Show the responsive hidden button
      if (button.classList.contains("hidden")) {
        button.classList.remove("hidden");
      }
    } else {
      // Logic when visible list is not overflowing the nav

      if (availableSpace > responsiveBreaks[responsiveBreaks.length - 1]) {
        // Logic when there is space for another item in the nav
        const hiddenLinks = getHiddenLinks();
        hiddenLinks[0].classList.remove("hidden");

        responsiveBreaks.pop(); // Move the item to the visible list
      }

      // Hide the resonsive hidden button if list is empty
      if (responsiveBreaks.length < 1) {
        button.classList.add("hidden");
      }
    }

    if (
      getWidth(list) > availableSpace ||
      responsiveBreaks[responsiveBreaks.length - 1] < availableSpace
    ) {
      // Occur again if the visible list is still overflowing the nav
      updateTopBar();
    }
  }

  // Window listeners
  window.addEventListener("resize", function () {
    updateTopBar();
  });
  button.addEventListener("click", function () {
    document.body.classList.toggle("js-nav_visible");
  });
  updateTopBar();
})();
