/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Link, useStaticQuery, graphql } from "gatsby"

import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <header id="site-header" class="layout_mast">
        <div class="layout_mast__title">
          <h1 class="layout_mast__heading">
            <a href="/">Frank's Movie Log</a>
          </h1>
        </div>
        <nav class="layout_mast__nav">
          <h2 class="layout_mast__nav_heading">Navigation</h2>
          <ul class="layout_mast__nav_list">
            <Link to="/">Home</Link>
            <Link to="/about/">About</Link>
            <Link to="/how-i-grade/">How I Grade</Link>
            <Link to="/reviews/">All Reviews</Link>
            <Link to="/viewings/">Viewing Log</Link>
            <Link to="/to-watch/">To-Watch List</Link>
            <Link to="/stats/">Stats</Link>
          </ul>
          <button class="layout_mast__nav_button" aria-label="Full Navigation">
            <svg
              class="layout_mast__menu_icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <rect x="0" y="0" width="100%" height="2" fill="#fff" />
              <rect x="0" y="9" width="100%" height="2" fill="#fff" />
              <rect x="0" y="18" width="100%" height="2" fill="#fff" />
            </svg>
          </button>
          <form
            class="layout_mast__nav_search_form"
            action="https://www.google.com/search"
            acceptCharset="UTF-8"
            method="get"
            role="search"
          >
            <label>
              <span class="layout_mast__search_heading">Search</span>
              <input
                type="text"
                class="layout_mast__search_input"
                name="q"
                placeholder="What are you looking for?"
              />
              <input
                type="hidden"
                name="q"
                value="site:movielog.frankshowalter.com"
              />
              <input
                type="submit"
                class="layout_mast__search_submit"
                value="Search"
              />
            </label>
          </form>
        </nav>
      </header>
      <main>{children}</main>
      <footer class="layout_footer">
        <div class="layout_footer__wrap">
          <p class="layout_footer__copyright">© 2020 Frank Showalter</p>
          <p class="layout_footer__notice">
            All stills used in accordance with the
            <a href="http://www.copyright.gov/title17/92chap1.html#107">
              Fair Use Law
            </a>
          </p>
          <a href="#site-header" class="layout_footer__to_the_top">
            To the top ↑
          </a>
        </div>
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
