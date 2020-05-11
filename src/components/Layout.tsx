import { Link } from "gatsby";
import React, { ReactNode } from "react";
import { Helmet } from "react-helmet";

import { css, Global } from "@emotion/core";
import styled from "@emotion/styled";

import background from "../assets/bkg_dark.png";
import hamburger from "../assets/hamburger.inline.svg";
import mobileBackground from "../assets/imissnotcomingsoon.jpg";
import logo from "../assets/logo.inline.svg";

export const breakpoints: { mid: string; max: string } = {
  mid: "768px",
  max: "1200px",
};

const cssVars = css`
  :root {
    --color-accent: #a9a287;
    --color-border: #e9e7e0;
    --color-content-background: #fff;
    --color-heading: #000;
    --color-link: #579;
    --color-primary: #e9e7e0;
    --color-secondary: #c9c4b3;
    --color-text-hint: rgba(0, 0, 0, 0.38);
    --color-text-primary: rgba(0, 0, 0, 0.87);
    --color-text-secondary: rgba(0, 0, 0, 0.54);
    --font-family-sans: "Charter", "Iowan Old Style", Georgia, Cambria,
      "Times New Roman", Times, serif;
    --font-family-system: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    --scrollbar-width: calc(100vw - 100%);
  }
`;

const cssReset = css`
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  a {
    color: var(--color-link);
    line-height: inherit;
    text-decoration: none;
  }

  body,
  html {
    font-size: 16px;
  }

  body {
    background: var(--color-primary);
    box-sizing: border-box;
    color: var(--color-text-primary);
    font-family: var(--font-family-sans);
    -webkit-font-smoothing: antialiased;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    margin: 0;
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
    font-style: normal;
    font-weight: 500;
    line-height: 1.3;
    margin: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    word-break: break-word;
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
  @media only screen and (min-width: ${breakpoints.mid}) {
    background: var(--color-content-background);
    margin: 0 auto;
    max-width: 900px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    display: flex;
    flex-wrap: wrap;
    max-width: 1160px;
  }
`;

const LogoHeading = styled.h1`
  margin: 0;
  padding: 0;
`;

const Logo = styled(logo)`
  background-color: transparent;
  fill: transparent;
  height: 50px;
  width: 50px;

  @media only screen and (min-width: ${breakpoints.mid}) {
    background: #202020 url(${mobileBackground}) repeat;
    height: 70px;
    width: 70px;
  }
`;

const LogoLink = styled(Link)`
  display: inline-block;
  margin-left: 10px;

  @media only screen and (min-width: ${breakpoints.mid}) {
    left: 30px;
    margin-left: 0;
    position: absolute;
    top: 11px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    left: 0;
    margin: 0 0 24px;
    position: relative;
    top: 0;
  }
`;

const Hamburger = styled(hamburger)`
  background-color: transparent;
  fill: #ddd;
  height: 25px;
  stroke: #ddd;
  width: 25px;

  rect {
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
    opacity: 0;
    width: 0;
  }

  [aria-expanded="true"] & rect:nth-of-type(4) {
    transform: rotate(-45deg);
  }
`;

const MenuToggle = styled.button`
  appearance: none;
  background: transparent;
  border: none;
  padding: 0;
  position: absolute;
  right: 20px;
  top: 14px;
  width: auto;

  @media only screen and (min-width: 48em) {
    display: none;
  }
`;

const Nav = styled.nav`
  background: #fff;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 300;
  height: calc(100vh - 56px);
  letter-spacing: 1px;
  opacity: 1;
  padding: 20px 20px 40px;
  position: absolute;
  transform: scale(1);
  transform-origin: 100% 0;
  transition: all 0.2s;
  width: 100%;
  z-index: 200;

  &.js-toggle_off {
    opacity: 1;
    transform: scale(0);

    @media only screen and (min-width: ${breakpoints.mid}) {
      transform: scale(1);
    }
  }

  @media only screen and (min-width: ${breakpoints.mid}) {
    background: transparent;
    display: block;
    height: auto;
    padding: 0;
    position: relative;
    visibility: visible;

    &.js-toggle_off {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const NavList = styled.ul`
  margin: 0;
  padding: 0;
`;

const NavListItem = styled.li`
  display: block;
`;

const HeaderWrap = styled.div`
  background: #202020 url(${mobileBackground}) repeat;
  width: 100%;

  @media only screen and (min-width: ${breakpoints.mid}) {
    background: var(--color-content-background);
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    margin: 20px 0 0 0;
    max-width: 210px;
    order: 2;
  }
`;

const Header = styled.header`
  margin: 0;
  opacity: 1;
  position: relative;

  @media only screen and (min-width: ${breakpoints.mid}) {
    padding: 0 30px 20px 120px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    border-left: solid 1px var(--color-border);
    margin: 0 auto;
    padding: 0 30px 2px 20px;
  }
`;

const NavLink = styled(Link)`
  border-bottom: 1px solid var(--color-border);
  clear: both;
  color: inherit;
  display: block;
  line-height: 49px;
  margin: 0;
  padding: 0;
  text-decoration: none;

  @media only screen and (min-width: ${breakpoints.mid}) and (max-width: ${breakpoints.max}) {
    border-bottom: none;
    display: inline-block;
    line-height: inherit;
    margin-right: 20px;
    padding: 10px 0;

    :nth-of-type(1) {
      margin-left: 10px;
    }
  }
`;

const TextInputWrap = styled.div`
  margin-top: 20px;
  width: 100%;

  @media only screen and (min-width: ${breakpoints.mid}) and (max-width: ${breakpoints.max}) {
    margin-top: 0;
  }
`;

const TextInput = styled.input`
  backface-visibility: hidden;
  background-color: #eee;
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  color: #222;
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 16px;
  padding: 10px;
  width: 100%;

  ::placeholder {
    color: var(--color-text-hint);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    font-size: 14px;
    font-weight: normal;
  }
`;

const ContentWrap = styled.div`
  background: var(--color-content-background);

  @media only screen and (min-width: ${breakpoints.mid}) {
    margin: 0 auto;
    max-width: 900px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    flex-basis: 900px;
    margin: 0 20px 0 30px;
    order: 1;
  }
`;

const Footer = styled.footer`
  background: #202020 url(${background}) repeat;
  color: var(--color-secondary);
  margin: 0 auto;
  padding: 40px 20px 60px;
  width: 100%;

  @media only screen and (min-width: ${breakpoints.max}) {
    flex-basis: 100%;
    order: 3;
  }
`;

const FooterList = styled.ul`
  line-height: 1.75;
  margin: 0 auto 20px;
  padding: 0;
  text-align: center;
`;

const FooterListItem = styled.li`
  display: inline-block;
  line-height: 2;
  margin: 0 0.75rem;
`;

const FooterLink = styled(Link)`
  color: inherit;
  letter-spacing: 0.3px;
  text-decoration: none;
  text-rendering: optimizeLegibility;
  white-space: nowrap;
`;

const footerSubLinkMixin = css`
  color: var(--color-secondary);
  letter-spacing: 0.3px;
  text-rendering: optimizeLegibility;
`;

const FooterSubLink = styled(Link)`
  ${footerSubLinkMixin}
`;

const FooterSubExternalLink = styled.a`
  ${footerSubLinkMixin}
`;

const FooterTextInputWrap = styled.div`
  border-bottom: solid 1px var(--color-primary);
  margin: 0 auto 10px;
  max-width: 180px;
`;

interface SearchFormProps {
  children: ReactNode;
}

function SearchForm({ children }: SearchFormProps): JSX.Element {
  return (
    <form
      action="https://www.google.com/search"
      acceptCharset="UTF-8"
      method="get"
    >
      <input type="hidden" name="q" value="site:www.franksmovielog.com" />
      {children}
    </form>
  );
}

interface Props {
  children: ReactNode;
  pageTitle?: string;
}

export default function Layout({ pageTitle, children }: Props): JSX.Element {
  const title = pageTitle
    ? `${pageTitle} | Frank's Movie Log`
    : `Frank's Movie Log`;

  return (
    <LayoutWrap>
      <Helmet>
        <html lang="en-US" />
        <title>{title}</title>
      </Helmet>
      <Global styles={cssVars} />
      <Global styles={cssReset} />
      <HeaderWrap>
        <Header>
          <LogoHeading>
            <LogoLink to="/">
              <Logo />
            </LogoLink>
          </LogoHeading>
          <Nav role="navigation" className="js-toggle js-toggle_off" id="menu">
            <NavList>
              <NavListItem>
                <NavLink to="/">Home</NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink to="/about/">About</NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink to="/how-i-grade/">How I Grade</NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink to="/reviews/">Reviews</NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink to="/viewings/">Viewing Log</NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink to="/watchlist/">Watchlist</NavLink>
              </NavListItem>
              <NavListItem>
                <NavLink to="/stats/">Stats</NavLink>
              </NavListItem>
            </NavList>
            <SearchForm>
              <TextInputWrap>
                <TextInput aria-label="search" name="q" placeholder="Search" />
              </TextInputWrap>
            </SearchForm>
          </Nav>
          <MenuToggle data-toggle="true" data-toggle-target="menu">
            <Hamburger />
          </MenuToggle>
        </Header>
      </HeaderWrap>
      <ContentWrap>{children}</ContentWrap>
      <Footer>
        <FooterList>
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
            <FooterLink to="/watchlist/">Watchlist</FooterLink>
          </FooterListItem>
          <FooterListItem>
            <FooterLink to="/stats/">Stats</FooterLink>
          </FooterListItem>
        </FooterList>
        <SearchForm>
          <FooterTextInputWrap>
            <TextInput aria-label="search" name="q" placeholder="Search" />
          </FooterTextInputWrap>
        </SearchForm>
        <FooterList>
          <FooterListItem>
            <FooterSubExternalLink href="https://letterboxd.com/frankshowalter/">
              Letterboxd
            </FooterSubExternalLink>
          </FooterListItem>
          <FooterListItem>
            <FooterSubLink to="/feed.xml">RSS</FooterSubLink>
          </FooterListItem>
        </FooterList>
      </Footer>
    </LayoutWrap>
  );
}
