/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import "./layout.scss";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header id="site-header" className="layout-mast">
        <div className="layout-mast_title">
          <h1 className="layout-mast_heading">
            <a href="/">Frank&apos;s Movie Log</a>
          </h1>
        </div>
        <nav className="layout-mast_nav">
          <h2 className="layout-mast_nav_heading">Navigation</h2>
          <ul className="layout-mast_nav_list">
            <Link to="/" className="layout-mast_nav_link">
              Home
            </Link>
            <Link to="/about/" className="layout-mast_nav_link">
              About
            </Link>
            <Link to="/how-i-grade/" className="layout-mast_nav_link">
              How I Grade
            </Link>
            <Link to="/reviews/" className="layout-mast_nav_link">
              All Reviews
            </Link>
            <Link to="/viewings/" className="layout-mast_nav_link">
              Viewing Log
            </Link>
            <Link to="/to-watch/" className="layout-mast_nav_link">
              To-Watch List
            </Link>
            <Link to="/stats/" className="layout-mast_nav_link">
              Stats
            </Link>
          </ul>
          <button
            type="button"
            className="layout-mast_nav_button"
            aria-label="Full Navigation"
          >
            <svg
              className="layout-mast_menu_icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <rect x="0" y="0" width="100%" height="2" fill="#fff" />
              <rect x="0" y="9" width="100%" height="2" fill="#fff" />
              <rect x="0" y="18" width="100%" height="2" fill="#fff" />
            </svg>
          </button>
          <form
            className="layout-mast_search_form"
            action="https://www.google.com/search"
            acceptCharset="UTF-8"
            method="get"
            role="search"
          >
            <label htmlFor="search">
              <span className="layout-mast_search_heading">Search</span>
              <input
                type="text"
                className="layout-mast_search_input"
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
                className="layout-mast_search_submit"
                value="Search"
              />
            </label>
          </form>
        </nav>
      </header>
      <main className="layout-children">{children}</main>
      <footer className="layout-footer">
        <div className="layout-footer_inner">
          <p className="layout-footer_copyright">© 2020 Frank Showalter</p>
          <p className="layout-footer_notice">
            All stills used in accordance with the
            <a href="http://www.copyright.gov/title17/92chap1.html#107">
              Fair Use Law
            </a>
          </p>
          <a href="#site-header" className="layout-footer_to_the_top">
            To the top ↑
          </a>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
