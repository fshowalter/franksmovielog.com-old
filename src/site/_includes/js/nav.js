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
      "[data-responsive-hidden-nav] li:not(.js--hidden)"
    );
  }

  function getHiddenLinks() {
    return document.querySelectorAll(
      "[data-responsive-hidden-nav] li.js--hidden"
    );
  }

  function updateTopBar() {
    var topBarStyles = getComputedStyle(topBar);

    var availableSpace =
      topBar.clientWidth -
      parseFloat(topBarStyles.paddingLeft) -
      parseFloat(topBarStyles.paddingRight) -
      getWidth(button);

    if (getWidth(list) > availableSpace) {
      // Logic when visible list is overflowing the nav

      responsiveBreaks.push(getWidth(list)); // Record the width of the list

      const visibleLinks = getVisibleLinks();

      visibleLinks[visibleLinks.length - 1].classList.add("js--hidden");

      // Show the responsive hidden button
      if (button.classList.contains("js--hidden")) {
        button.classList.remove("js--hidden");
      }
    } else {
      // Logic when visible list is not overflowing the nav

      if (availableSpace > responsiveBreaks[responsiveBreaks.length - 1]) {
        // Logic when there is space for another item in the nav
        const hiddenLinks = getHiddenLinks();
        hiddenLinks[0].classList.remove("js--hidden");

        responsiveBreaks.pop(); // Move the item to the visible list
      }

      // Hide the resonsive hidden button if list is empty
      if (responsiveBreaks.length < 1) {
        button.classList.add("js--hidden");
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
    document.documentElement.classList.toggle("js-nav-visible");
  });
  button.addEventListener("transitionend", function () {
    if (document.documentElement.classList.contains("js-nav-visible")) {
      return;
    }

    updateTopBar();
  });

  updateTopBar();
})();
