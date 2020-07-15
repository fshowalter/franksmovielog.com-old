/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useReducer } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
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

function Layout({ children }) {
  const [state, dispatch] = useReducer(reducer, {}, initState);

  return (
    <div
      className={`${styles.container} ${
        state.navVisible ? styles.mast_nav_visible : ""
      }`}
    >
      <header id="site-header" className={styles.mast}>
        <h1 className={styles.mast_heading}>
          <a href="/">Frank&apos;s Movie Log</a>
        </h1>
        <button
          type="button"
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
        <nav className={styles.mast_nav}>
          <h2 className={styles.mast_nav_heading}>Navigation</h2>
          <ul className={styles.mast_nav_list}>
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
