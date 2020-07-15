/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useReducer, useLayoutEffect, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import "../../styles/js.scss";
import styles from "./layout.module.scss";

function initState() {
  return {
    navVisible: false,
  };
}

const actions = {
  TOGGLE_NAV: "TOGGLE_NAV",
};

function reducer(state, action) {
  switch (action.type) {
    case actions.TOGGLE_NAV: {
      return {
        ...state,
        navVisible: !state.navVisible,
      };
    }
    default:
      throw new Error();
  }
}

function MastNavLink({ to, children }) {
  return (
    <Link to={to} className={styles.mast_nav_link}>
      {children}
    </Link>
  );
}

MastNavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const responsiveBreaks = []; // Empty List (Array) on initialization

function getWidth(element) {
  return parseFloat(getComputedStyle(element, null).width.replace("px", ""));
}

function getVisibleLinks(element) {
  return element.querySelectorAll("li:not(.js--hidden)");
}

function getHiddenLinks(element) {
  return element.querySelectorAll("li.js--hidden");
}

function updateNavBar({ navBarEl, navListEl, navButtonEl }) {
  const availableSpace = document.documentElement.clientWidth;

  if (getWidth(navListEl) > availableSpace) {
    // Logic when visible list is overflowing the nav

    responsiveBreaks.push(getWidth(navListEl)); // Record the width of the list

    const visibleLinks = getVisibleLinks(navListEl);

    visibleLinks[visibleLinks.length - 1].classList.add("js--hidden");

    // Show the responsive hidden button
    if (navButtonEl.classList.contains("js--hidden")) {
      navButtonEl.classList.remove("js--hidden");
    }
  } else {
    // Logic when visible list is not overflowing the nav

    if (availableSpace > responsiveBreaks[responsiveBreaks.length - 1]) {
      // Logic when there is space for another item in the nav
      const hiddenLinks = getHiddenLinks(navListEl);
      hiddenLinks[0].classList.remove("js--hidden");

      responsiveBreaks.pop(); // Move the item to the visible list
    }

    // Hide the resonsive hidden button if list is empty
    if (responsiveBreaks.length < 1) {
      navButtonEl.classList.add("js--hidden");
    }
  }

  if (
    getWidth(navListEl) > availableSpace ||
    responsiveBreaks[responsiveBreaks.length - 1] < availableSpace
  ) {
    // Occur again if the visible list is still overflowing the nav
    updateNavBar({ navBarEl, navListEl, navButtonEl });
  }
}

function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

function Layout({ children }) {
  const [state, dispatch] = useReducer(reducer, {}, initState);
  const navBarEl = useRef(null);
  const navButtonEl = useRef(null);
  const navListEl = useRef(null);

  useLayoutEffect(() => {
    updateNavBar({
      navBarEl: navBarEl.current,
      navButtonEl: navButtonEl.current,
      navListEl: navListEl.current,
    });
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      updateNavBar({
        navBarEl: navBarEl.current,
        navButtonEl: navButtonEl.current,
        navListEl: navListEl.current,
      });
    }, 50);

    window.addEventListener("resize", debouncedHandleResize);

    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  return (
    <div
      className={`${styles.container} ${
        state.navVisible ? styles.mast_nav_visible : ""
      }`}
    >
      <header id="site-header" className={styles.mast}>
        <div className={styles.mast_logo}>
          <h1 className={styles.mast_heading}>
            <a href="/">Frank&apos;s Movie Log</a>
          </h1>
          <p className={styles.mast_tagline}>My life at the movies.</p>
        </div>

        <nav ref={navBarEl} className={styles.mast_nav}>
          <h2 className={styles.mast_nav_heading}>Navigation</h2>
          <ul ref={navListEl} className={styles.mast_nav_list}>
            <li>
              <MastNavLink to="/">Home</MastNavLink>
            </li>
            <li>
              <MastNavLink to="/about/">About</MastNavLink>
            </li>
            <li>
              <MastNavLink to="/how-i-grade/">How I Grade</MastNavLink>
            </li>
            <li>
              <MastNavLink to="/reviews/">All Reviews</MastNavLink>
            </li>
            <li>
              <MastNavLink to="/viewings/">Viewing Log</MastNavLink>
            </li>
            <li>
              <MastNavLink to="/watchlist/">Watchlist</MastNavLink>
            </li>
            <button
              type="button"
              ref={navButtonEl}
              className={styles.mast_nav_button}
              aria-label="Full Navigation"
              onClick={() => dispatch({ type: actions.TOGGLE_NAV })}
            >
              <svg
                className={styles.mast_menu_icon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <rect x="0" y="0" width="100%" height="2" fill="#fff" />
                <rect x="0" y="9" width="100%" height="2" fill="#fff" />
                <rect x="0" y="18" width="100%" height="2" fill="#fff" />
              </svg>
            </button>
          </ul>
          <form
            action="https://www.google.com/search"
            acceptCharset="UTF-8"
            method="get"
            role="search"
          >
            <label htmlFor="search" className={styles.mast_search_form}>
              <span className={styles.mast_search_label}>Search</span>
              <input
                type="text"
                className={styles.mast_search_input}
                name="q"
                id="search"
                placeholder="What are you looking for?"
              />
              <input
                type="hidden"
                name="q"
                value="site:movielog.frankshowalter.com"
              />
              <input
                type="submit"
                className={styles.mast_search_submit}
                value="Search"
              />
            </label>
          </form>
        </nav>
      </header>
      <main className={styles.children}>{children}</main>
      <footer className={styles.footer}>
        <a href="#site-header" className={styles.footer_to_the_top}>
          To the top ↑
        </a>
        <p className={styles.footer_copyright}>
          All stills used in accordance with the{" "}
          <a href="http://www.copyright.gov/title17/92chap1.html#107">
            Fair Use Law.
          </a>
        </p>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
