import { graphql, Link, StaticQuery } from "gatsby";
import { FluidObject } from "gatsby-image";
import React, { ReactNode } from "react";
import { Helmet } from "react-helmet";

import { css, Global } from "@emotion/core";
import styled from "@emotion/styled";

import background from "../assets/bkg_dark.png";
import close from "../assets/close.inline.svg";
import texture from "../assets/imissnotcomingsoon.jpg";
import nav from "../assets/nav.inline.svg";
import search from "../assets/search.inline.svg";
import Grade from "./Grade";

export const breakpoints: { mid: string; max: string } = {
  mid: "840px",
  max: "1400px",
};

const cssVars = css`
  :root {
    --ratio: 1.61803398875;
    --gutter: 1.5rem;
    --color-accent: #a9a287;
    --color-border: #e9e7e0;
    --color-content-background: #fff;
    --color-link: #579;
    --color-primary: #e9e7e0;
    --color-secondary: #c9c4b3;
    --color-text-hint: rgba(0, 0, 0, 0.38);
    --color-text-primary: rgba(0, 0, 0, 0.87);
    --color-text-secondary: rgba(0, 0, 0, 0.54);
    --color-text-heading: rgba(0, 0, 0, 0.75);
    --font-family-serif: "Charter", "Iowan Old Style", Georgia, Cambria,
      "Times New Roman", Times, serif;
    --font-family-system: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    --font-size-heading: calc(1rem * 1.75);
    --font-size-sub-heading: calc(1rem * 1.375);
    --font-size-base: calc(1rem * 1.125);
    --font-size-sub-base: calc(1rem * 0.875);
    --font-size-sub-sub-base: calc(1rem * 0.75);
    --line-multiplier: 1.75;
    --one-line: calc(1rem * var(--line-multiplier));
  }
`;

const cssReset = css`
  *,
  *:before,
  *:after {
    box-sizing: inherit;
    word-break: break-word;
    word-wrap: break-word;
  }

  a {
    color: var(--color-link);
    line-height: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  body {
    background: #fcfcfc;
    box-sizing: border-box;
    color: var(--color-text-primary);
    font-family: var(--font-family-system);
    font-size: 1.8rem;
    -webkit-font-smoothing: antialiased;
    font-style: normal;
    /* font-weight: 500; */
    /* letter-spacing: -0.015em; */
    margin: 0;
    text-align: left;
  }

  p {
    margin: 0;
    text-rendering: optimizeLegibility;
    word-break: break-word;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--color-heading);
    font-feature-settings: "lnum";
    font-variant-numeric: lining-nums;
    font-weight: 500;
    letter-spacing: -0.0415625em;
    line-height: 1.3;
    margin: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    word-break: break-word;
  }

  html {
    font-size: 62.5%;

    &.modalOpen {
      left: 0;
      overflow-y: scroll;
      position: fixed;
      top: 0;
      width: 100%;
    }
  }

  blockquote {
    border-color: #cd2653;
    border-style: solid;
    border-width: 0 0 0 0.2rem;
    color: inherit;
    font-family: var(--font-family-system);
    font-size: smaller;
    margin: 4rem 0;
    padding: 0.5rem 0 0.5rem 2rem;
  }

  .js-no_outline {
    a {
      outline: none;
    }
    button {
      outline: none;
    }
    input {
      outline: none;
    }
  }
`;

const LayoutWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;

  &:before {
    background: url(${texture}) repeat;
    content: "";
    height: 2rem;
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
  }

  /* @media only screen and (min-width: ${breakpoints.max}) {
    flex-direction: row;
    justify-content: space-between;
  } */
`;

const LogoHeading = styled.h1`
  /* font-size: 2.4rem;
  font-weight: 700; */
  font-size: 2.6rem;
  /* font-weight: 500; */
  font-weight: 900;
  letter-spacing: normal;
  line-height: 1;

  @media only screen and (min-width: 700px) {
    font-size: 2.6rem;
  }

  @media only screen and (min-width: 1000px) {
    margin: 1rem 0 0 2.4rem;
  }
`;

const LogoLink = styled(Link)`
  /* color: #fff; */
  color: #000;
  display: block;
  /* display: flex;
  flex-direction: column;
  height: 56px;
  justify-content: center;
  margin-left: 14px; */
  /* font-family: var(--font-family-serif); */

  /* @media only screen and (min-width: ${breakpoints.mid}) {
    margin: 0;
  } */

  /* &:before {
    background: url(${texture});
    border-radius: 50%;
    color: #fff;
    content: 'M';
    font-size: 2.7rem;
    height: 4.2rem;
    left: 2rem;
    line-height: 4.2rem;
    position: absolute;
    text-align: center;
    top: 3.5rem;
    width: 4.2rem;
  } */
`;

const Hamburger = styled(nav)`
  background-color: transparent;
  fill: #000;
  /* fill: #fff; */
  height: 30px;
  width: 30px;

  @media only screen and (min-width: 700px) {
    width: 30px;
  }
  /* rect {
    transform: rotate(0deg);
    transform-origin: 0% 50%;
    transition: all 0.2s linear;
  }

  [aria-expanded="true"] & rect:nth-of-type(1) {
    transform: rotate(45deg);
  }
  [aria-expanded="true"] & rect:nth-of-type(2) {
    opacity: 0;
    width: 0;
  }
  [aria-expanded="true"] & rect:nth-of-type(3) {
    transform: rotate(-45deg);
  } */
`;

const Search = styled(search)`
  height: 2.5rem;
  max-width: 2.3rem;
  width: 2.3rem;
  /* @media only screen and (min-width: ${breakpoints.mid}) {
    background-color: transparent;
    display: block;
    fill: #000;
    fill: rgba(255, 255, 255, 0.87);
    fill: var(--color-text-primary);
    height: 25px;
    margin: 4px 0;
    width: 25px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    margin-right: 0;
  }

  &.open {
    opacity: 1;
    visibility: visible;
  } */
`;

const Close = styled(close)`
  background-color: transparent;
  display: block;
  fill: var(--color-text-primary);
  height: 2rem;
  /* margin: 0 10px 0 15px; */
  /* stroke: #000; */
  margin: 0.5rem;
  width: 2rem;
`;

const CloseSearch = styled(close)`
  background-color: transparent;
  display: block;
  fill: var(--color-text-primary);
  height: 25px;
  /* margin: 0 10px 0 15px; */
  /* stroke: #000; */
  width: 25px;
`;

const SearchToggle = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  font-size: inherit;
  font-weight: 400;
  letter-spacing: inherit;
  overflow: visible;
  padding: 0 2rem;
  text-transform: none;

  @media only screen and (min-width: 1000px) {
    align-items: flex-start;
    bottom: auto;
    display: none;
    height: 4.4rem;
    left: auto;
    padding: 0 4rem;
    position: relative;
    right: auto;
    top: auto;
    width: auto;
  }

  @media only screen and (min-width: 1220px) {
    padding: 0 4rem;
  }
`;

const MenuToggle = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: 0;
  bottom: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  letter-spacing: inherit;
  padding: 0 2rem;
  position: absolute;
  right: 0;
  top: 0;
  /* top: -14rem; */
  width: auto;

  @media only screen and (min-width: 700px) {
    display: none;
    padding: 0 4rem;
    width: auto;
  }

  @media only screen and (min-width: 1000px) {
    display: none;
  }
`;

const CloseNav = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  height: 12.9rem;
  justify-content: flex-end;
  line-height: 1.25;
  padding: 0 2rem;
  position: absolute;
  right: 0;
  top: 0;

  @media only screen and (min-width: 700px) {
    display: none;
    padding: 3rem 4rem 6.4rem 0;
  }

  @media only screen and (min-width: 1000px) {
    display: none;
  }
`;

const CloseSearchButton = styled.button`
  display: none;

  @media only screen and (min-width: ${breakpoints.mid}) and (max-width: ${breakpoints.max}) {
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const Nav = styled.nav`
  align-items: center;
  background: #fcfcfc;
  bottom: 0;
  box-sizing: border-box;
  height: 100vh;
  left: -99999rem;
  opacity: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 12.9rem 0 0;
  position: fixed;
  right: 99999rem;
  top: 0;
  transition: opacity 0.25s ease-in, left 0s 0.25s, right 0s 0.25s;
  z-index: 99;

  &.open {
    left: 0;
    opacity: 1;
    right: 0;
    transition: opacity 0.25s ease-out;
  }

  @media only screen and (min-width: 700px) {
    border-top: solid 0.1rem #d8d8d8;
    display: flex;
    height: auto;
    opacity: 1;
    padding: 0;
    position: static;
  }
`;

const NavList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;

  @media only screen and (min-width: 700px) {
    display: flex;
    flex-wrap: wrap;
    font-size: 1.8rem;
    font-weight: 500;
    justify-content: flex-end;
    letter-spacing: -0.0277em;
    margin: 0 0 0 -1.6rem;
    padding-top: .5rem;
  }

  /* @media only screen and (min-width: ${breakpoints.mid}) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin: 0;
    padding: 7px 0 0;
  } */

  /* @media only screen and (min-width: ${breakpoints.max}) {
    padding: 0;
    width: 100%;
  } */

  @media only screen and (min-width: 1220px) {
    margin: -0.8rem 0 0 -2.5rem
  }
`;

const NavListItem = styled.li`
  /* border-top: solid 0.1rem #d8d8d8; */
  line-height: 1;

  &:last-child {
    border-bottom: solid 0.1rem #d8d8d8;
  }

  @media screen and (min-width: 700px) {
    border: none;
    display: block;
    line-height: 1.25;
    margin: 0 0 0 1.6rem;
    position: relative;

    &:last-child {
      border: none;
    }
  }

  @media screen and (min-width: 1220px) {
    margin: 1rem 0 0 2.5rem;
  }
`;

const Header = styled.header`
  /* box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05); */
  color: var(--color-text-primary);
  margin: 0 auto;
  max-width: 100rem;
  padding-top: 2rem;
  position: relative;
  width: 100%;
`;

const NavLink = styled(Link)`
  color: #e90b1d;
  display: block;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.0375em;
  padding: 2rem 2.5rem;
  text-decoration: none;
  width: 100%;

  @media screen and (min-width: 700px) {
    /* padding: 2rem 4rem; */
    font-size: 1.4rem;
    font-weight: 500;
    letter-spacing: 1.5px;
    line-height: 1.5;
    padding: 0;
    text-transform: uppercase;
  }

  @media screen and (min-width: 1000px) {
    /* font-weight: 500;
    letter-spacing: -0.0277em;
    line-height: 2.5rem;
    margin: 0;
    padding: 0; */
  }
`;

const TextInputWrap = styled.div`
  margin: 0 0 0 2.4rem;
  width: calc(100% - 2.4rem);
`;

const TextInput = styled.input`
  backface-visibility: hidden;
  background-color: #eee;
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  color: var(--color-text-primary);
  display: block;
  font-family: var(--font-family-system);
  font-size: 16px;
  margin: 0;
  padding: 10px;
  width: 100%;

  ::placeholder {
    color: var(--color-text-hint);
    font-family: var(--font-family-system);
    font-size: 14px;
    font-weight: normal;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    padding: 5px 10px;
  }
`;

const ContentWrap = styled.div`
  /* background: var(--color-content-background); */
  /* flex: 1; */
  /* margin: 0 auto;
  max-width: 1000px; */

  /* @media only screen and (min-width: ${breakpoints.mid}) {
    &:after {
      clear: both;
      content: "";
      display: block;
    }
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    margin: 0 auto;
    order: 1;
    width: 1000px;
  } */
`;

const Footer = styled.footer`
  border-top: solid .1rem #d8d8d8;
  margin-top: 5rem;

  @media only screen and (min-width: 700px) {
    margin-top: 8rem;
  }

  /* background: #202020 url(${background}) repeat;
  display: none;
  font-size: 14px;
  font-weight: 900;
  margin: 0 auto;
  padding: 24px;
  width: 100%;

  @media only screen and (min-width: ${breakpoints.max}) {
    order: 2;
  } */
`;

const FooterInner = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 120rem;
  width: calc(100% - 4rem);

  @media only screen and (min-width: 700px) {
    width: calc(100% - 8rem);
  }
`;

const FooterNav = styled.nav`
  border-bottom: 0.1rem solid #d8d8d8;
  display: flex;
  flex-direction: column;
  padding: 3rem 0;

  @media (min-width: 700px) {
    padding: 3.7rem 0;
  }

  @media (min-width: 1000px) {
    align-items: center;
  }
`;

const FooterList = styled.ul`
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.0277em;
  list-style: none;
  margin: 1em 0;
  padding: 0;

  @media (min-width: 700px) {
    font-size: 2.4rem;
    margin: -0.8rem 0 1em -1.6rem;
  }

  @media (min-width: 1000px) {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    font-size: 2.1rem;
    justify-content: flex-start;
    margin: -1.2rem 0 1em -2.4rem;
  }
`;

const FooterAsideList = styled.ul`
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.0277em;
  list-style: none;
  padding: 0 0 3rem 0;

  @media (min-width: 700px) {
    font-size: 2.4rem;
    margin: -0.8rem 0 0 -1.6rem;
    padding: 0 0 5rem 0;
  }

  @media (min-width: 1000px) {
    font-size: 2.1rem;
    margin: -1.2rem 0 0 -2.4rem;
  }

  &:last-of-type {
    padding-bottom: 0;
  }
`;

const FooterListItem = styled.li`
  line-height: 1.25;
  margin: 0 0 1rem 0;

  @media (min-width: 700px) {
    margin: 0.8rem 0 0 1.6rem;
  }

  @media (min-width: 1000px) {
    margin: 1.2rem 0 0 2.4rem;
  }
`;

const FooterLink = styled(Link)`
  color: #e90b1d;
  /* color: rgba(255, 255, 255, 0.54);
  display: block;
  padding: 4px 12px;
  text-decoration: none;
  white-space: nowrap; */
`;

const FooterSubExternalLink = styled.a`
  color: #e90b1d;
`;

const FooterTextInputWrap = styled.div`
  margin: 0 0 0 2.4rem;
  width: calc(100% - 2.4rem);
`;

const FooterSlug = styled.div`
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  font-family: var(--font-family-system);
  font-size: 1.6rem;
  justify-content: space-between;
  letter-spacing: -0.015em;
  margin-left: auto;
  margin-right: auto;
  max-width: 120rem;
  padding: 3rem 0;
  width: calc(100% - 4rem);

  @media (min-width: 700px) {
    font-size: 1.8rem;
    padding: 4.3rem 0;
    width: calc(100% - 8rem);
  }
`;

const SearchFormWrap = styled.div`
  padding: 2rem 2.5rem;

  @media (min-width: 700px) {
    display: none;
    margin: 0 auto;
    padding: 2rem 0;
    width: calc(100% - 8rem);
  }

  @media (min-width: 1000px) {
    display: none;
  }
`;

interface SearchFormProps {
  className?: string;
  role?: string;
  children: ReactNode;
}

function SearchForm({ children }: SearchFormProps): JSX.Element {
  return (
    <form
      css={css`
        align-items: center;
        display: flex;
        flex-grow: 1;
        justify-content: flex-start;
      `}
      action="https://www.google.com/search"
      acceptCharset="UTF-8"
      method="get"
      role="search"
    >
      <input type="hidden" name="q" value="site:www.franksmovielog.com" />
      {children}
    </form>
  );
}

const ButtonContentWrap = styled.span`
  /* background: url(${texture}); */
  /* border-radius: 5px; */
  box-sizing: border-box;
  display: flex;
  height: auto;
  justify-content: center;
  /* margin-top: 3rem; */
  position: relative;

  @media only screen and (min-width: 700px) {
    /* margin-top: -2.5rem; */
  }
`;

const ButtonLabel = styled.span`
  color: #6d6d6d;
  /* color: #fff; */
  font-family: var(--font-family-system);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: inherit;
  position: absolute;
  top: calc(100%);
  white-space: nowrap;
  width: auto;
  word-break: break-all;

  @media only screen and (min-width: 700px) {
    font-size: 1.2rem;
  }

  @media only screen and (min-width: 1000px) {
    left: 0;
    right: 0;
    text-align: center;
    top: calc(100% - 1.1rem);
    width: auto;
  }
`;

const CloseNavLabel = styled.span`
  display: block;
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 2.1rem;
  margin-right: 1.6rem;
`;

const Tagline = styled.span`
  color: #6d6d6d;
  /* display: none; */
  font-size: 1.5rem;
  /* font-weight: 600;
  font-weight: 500; */
  font-weight: 400;
  padding-top: 0.5rem;
  transition: all 0.15s linear;

  @media only screen and (min-width: 700px) {
    display: block;
    font-size: 1.8rem;
    letter-spacing: -0.0311em;
  }

  @media only screen and (min-width: 1000px) {
    font-size: 18px;
    margin: 0 0 0 2.4rem;
    padding-top: 0.2rem;
  }
`;

const LogoWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 5rem 0 0;

  @media only screen and (min-width: 700px) {
    justify-content: flex-start;
    margin-bottom: 1rem;
    text-align: left;
  }

  @media only screen and (min-width: 1000px) {
    align-items: baseline;
    flex-direction: row;
    flex-wrap: wrap;
    margin: -1rem 4rem 0 -2.4rem;
  }
`;

const SearchButtonWrap = styled.div`
  display: none;

  @media only screen and (min-width: 700px) {
    align-items: center;
    bottom: auto;
    display: flex;
    flex-shrink: 0;
    height: 4.4rem;
    left: auto;
    margin-left: 3rem;
    margin-right: -3rem;
    margin-top: -0.7rem;
    overflow: visible;
    position: absolute;
    right: 4rem;
    top: 2rem;
    width: auto;

    &:before {
      background: #dedfdf;
      content: "";
      display: block;
      height: 2.7rem;
      left: 0;
      position: absolute;
      top: calc(50% - 1.35rem);
      width: 0.1rem;
    }
  }

  @media only screen and (min-width: 1220px) {
    margin-left: 4rem;
    margin-right: -4rem;
  }
`;

const HeaderWrap = styled.div`
  display: flex;
  justify-content: left;
  letter-spacing: -0.015em;
  margin: 0 auto;
  max-width: 168rem;
  padding: 2rem 0;
  position: relative;
  width: calc(100% - 4rem);

  @media only screen and (min-width: 700px) {
    align-items: baseline;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 8rem);
  }

  @media only screen and (min-width: 1000px) {
    padding: 2.8rem 0;
  }
`;

const Credits = styled.div`
  @media (min-width: 700px) {
    align-items: baseline;
    display: flex;
  }
`;

const Copyright = styled.p`
  font-weight: 600;
  line-height: 1.5;
  margin: 0;

  @media (min-width: 700px) {
    font-weight: 700;
  }
`;

const ImageNotice = styled.p`
  color: #6d6d6d;
  font-size: 1.4rem;
  margin-top: 2rem;
  width: 100%;

  & a {
    color: #000;
  }

  @media (min-width: 700px) {
    margin: 0 0 0 2.4rem;
  }
`;

const FooterAside = styled.aside`
  border-bottom: 0.1rem solid #d8d8d8;
  padding: 3rem 0;

  @media (min-width: 700px) {
    padding: 8rem 0;
  }
`;

const RecentPostGrade = styled(Grade)`
  height: 1.8rem;
`;

const RecentPostYear = styled.span`
  font-size: 1.8rem;
  font-weight: 300;
`;

const FooterAsideHeading = styled.h2`
  font-family: var(--font-family-system);
  font-feature-settings: "lnum";
  font-size: 2.8rem;
  font-variant-numeric: lining-nums;
  font-weight: 700;
  letter-spacing: -0.0415625em;
  line-height: 1.25;
  margin: 0 0 2rem;

  @media (min-width: 700px) {
    font-size: 4rem;
    margin-bottom: 3rem;
  }
`;

interface Props {
  children: ReactNode;
  pageTitle?: string;
}

interface RecentPost {
  grade: string;
  sequence: number;
  slug: string;
  movie: {
    title: string;
    year: string;
  };
  markdown: {
    backdrop?: {
      childImageSharp?: {
        fluid: FluidObject;
      };
    };
  };
}

export default function Layout({ pageTitle, children }: Props): JSX.Element {
  const title = pageTitle
    ? `${pageTitle} | Frank's Movie Log`
    : `Frank's Movie Log`;

  const [navVisible, setNavVisible] = React.useState(false);

  const toggleNav = (): void => {
    setNavVisible(!navVisible);
  };

  const [searchVisible, setSearchVisible] = React.useState(false);

  const toggleSearch = (): void => {
    setSearchVisible(!searchVisible);
  };

  return (
    <LayoutWrap className={navVisible ? "modalOpen" : undefined}>
      <Helmet>
        <html lang="en-US" />
        <title>{title}</title>
      </Helmet>
      <Global styles={cssVars} />
      <Global styles={cssReset} />
      <Header id="site-header">
        <HeaderWrap>
          <LogoWrap>
            <LogoHeading>
              <LogoLink to="/">Frank&apos;s Movie Log</LogoLink>
            </LogoHeading>
            <Tagline>
              {/* Quality movie reviews of movies of questionable quality. */}
              (Almost) Everything I Watch
            </Tagline>
          </LogoWrap>
          <MenuToggle onClick={toggleNav} aria-expanded={navVisible}>
            <ButtonContentWrap>
              <Hamburger />
              <ButtonLabel>Menu</ButtonLabel>
            </ButtonContentWrap>
          </MenuToggle>
          <Nav role="navigation" className={navVisible ? "open" : undefined}>
            <CloseNav onClick={toggleNav}>
              <CloseNavLabel>Close Menu</CloseNavLabel>
              <Close />
            </CloseNav>
            <NavList>
              <NavListItem>
                <NavLink activeClassName="active" to="/">
                  Home
                </NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink activeClassName="active" to="/about/">
                  About
                </NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink activeClassName="active" to="/how-i-grade/">
                  How I Grade
                </NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink activeClassName="active" to="/reviews/">
                  Reviews
                </NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink activeClassName="active" to="/viewings/">
                  Viewings
                </NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink activeClassName="active" to="/to-watch/">
                  To-Watch
                </NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink activeClassName="active" to="/stats/">
                  Stats
                </NavLink>
              </NavListItem>
            </NavList>
            <SearchButtonWrap>
              <SearchToggle
                onClick={toggleSearch}
                aria-expanded={searchVisible}
              >
                <Search />
                <ButtonLabel>Search</ButtonLabel>
              </SearchToggle>
            </SearchButtonWrap>
            <SearchFormWrap className={searchVisible ? "open" : undefined}>
              <SearchForm>
                <Search />
                <TextInputWrap>
                  <TextInput
                    aria-label="search"
                    name="q"
                    placeholder="Search"
                  />
                </TextInputWrap>
              </SearchForm>
              <CloseSearchButton onClick={toggleSearch}>
                <CloseSearch />
              </CloseSearchButton>
            </SearchFormWrap>
          </Nav>
        </HeaderWrap>
      </Header>
      <ContentWrap>{children}</ContentWrap>
      <Footer>
        <FooterInner>
          <FooterNav>
            <FooterList>
              <FooterListItem>
                <FooterLink to="/">Home</FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/about/">About</FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/how-i-grade/">How I Grade</FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/reviews/">Reviews</FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/viewings/">Viewing Log</FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/to-watch/">To-Watch</FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/stats/">Stats</FooterLink>
              </FooterListItem>
            </FooterList>
            <SearchForm>
              <Search />
              <FooterTextInputWrap>
                <TextInput aria-label="search" name="q" placeholder="Search" />
              </FooterTextInputWrap>
            </SearchForm>
          </FooterNav>
          <FooterAside>
            <FooterAsideHeading>Recent</FooterAsideHeading>
            <StaticQuery
              query={graphql`
                query RecentPostsQuery {
                  allReview(
                    sort: { fields: [sequence], order: DESC }
                    limit: 5
                  ) {
                    nodes {
                      grade
                      slug
                      sequence
                      markdown {
                        backdrop {
                          childImageSharp {
                            fluid(
                              toFormat: JPG
                              jpegQuality: 75
                              maxWidth: 684
                            ) {
                              ...GatsbyImageSharpFluid
                            }
                          }
                        }
                      }
                      movie {
                        title
                        year
                      }
                    }
                  }
                }
              `}
              render={(data): JSX.Element => (
                <FooterAsideList>
                  {data.allReview.nodes.map((node: RecentPost) => (
                    <FooterListItem key={node.sequence}>
                      <FooterLink to={`/reviews/${node.slug}/`}>
                        {node.movie.title}{" "}
                        <RecentPostYear>{node.movie.year}</RecentPostYear>{" "}
                        <RecentPostGrade grade={node.grade} />
                      </FooterLink>
                    </FooterListItem>
                  ))}
                </FooterAsideList>
              )}
            />
            <FooterAsideHeading>Elsewhere</FooterAsideHeading>
            <FooterAsideList>
              <FooterListItem>
                <FooterSubExternalLink href="https://letterboxd.com/frankshowalter/">
                  Letterboxd
                </FooterSubExternalLink>
              </FooterListItem>
            </FooterAsideList>
            <FooterAsideHeading>Syndication</FooterAsideHeading>
            <FooterAsideList>
              <FooterListItem>
                <FooterLink to="/feed.xml">RSS</FooterLink>
              </FooterListItem>
            </FooterAsideList>
          </FooterAside>
        </FooterInner>
        <FooterSlug>
          <Credits>
            <Copyright>© 2020 Frank Showalter</Copyright>
          </Credits>
          <a
            css={css`
              color: #6d6d6d;
            `}
            href="#site-header"
          >
            To the top ↑
          </a>
          <ImageNotice>
            All stills used in accordance with the{" "}
            <a href="http://www.copyright.gov/title17/92chap1.html#107">
              Fair Use Law
            </a>
            .
          </ImageNotice>
        </FooterSlug>
      </Footer>
    </LayoutWrap>
  );
}
