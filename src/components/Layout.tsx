import { Link } from "gatsby";
import React, { ReactNode } from "react";
import { Helmet } from "react-helmet";

import { css, Global } from "@emotion/core";
import styled from "@emotion/styled";

import testBackground from "../assets/background.jpg";
import background from "../assets/bkg_dark.png";
import hamburger from "../assets/hamburger.inline.svg";
import logo from "../assets/logo.inline.svg";

export const breakpoints: { mid: string; max: string } = {
  mid: "750px",
  max: "1200px",
};

const cssVars = css`
  :root {
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
    font-family: var(--font-family-system);
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
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media only screen and (min-width: ${breakpoints.mid}) {
    background: var(--color-content-background);
    margin: 0 auto;
    max-width: 900px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    max-width: 1200px;
    padding: 30px 0 0;
  }
`;

const LogoHeading = styled.h1`
  line-height: 0;
  margin: 0;
  padding: 0;

  @media only screen and (min-width: ${breakpoints.max}) {
    padding-left: 30px;
  }
`;

const Logo = styled(logo)`
  background-color: transparent;
  fill: transparent;
  height: 50px;
  width: 50px;

  @media only screen and (min-width: ${breakpoints.mid}) {
    background: #202020 url(${testBackground}) repeat;
    height: 70px;
    margin-right: 24px;
    width: 70px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    margin-right: 0;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 56px;
  justify-content: center;
  margin-left: 14px;

  @media only screen and (min-width: ${breakpoints.mid}) {
    height: auto;
    margin: 0;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    display: inline-block;
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
  margin: 0 10px 0 15px;
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
  height: 56px;
  margin-right: 14px;
  padding: 0;
  width: 50px;

  @media only screen and (min-width: ${breakpoints.mid}) {
    display: none;
  }
`;

const Nav = styled.nav`
  background: #fff;
  box-sizing: border-box;
  font-family: var(--font-family-system);
  font-size: 14px;
  font-weight: 900;
  height: calc(100vh - 56px);
  letter-spacing: 1px;
  opacity: 0;
  padding: 20px 24px 40px;
  position: absolute;
  top: 56px;
  transition: opacity 0.2s;
  visibility: hidden;
  width: 100%;
  z-index: 200;

  &.open {
    opacity: 1;
    visibility: visible;
  }

  @media only screen and (min-width: ${breakpoints.mid}) {
    background: transparent;
    color: var(--color-text-secondary);
    font-weight: 900;
    height: auto;
    letter-spacing: normal;
    opacity: 1;
    padding: 0;
    position: relative;
    top: auto;
    visibility: visible;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    padding-bottom: 8px;
    padding-left: 30px;
  }
`;

const NavList = styled.ul`
  margin: 0 0 24px;
  padding: 0;

  @media only screen and (min-width: ${breakpoints.mid}) {
    display: flex;
    justify-content: space-between;
    margin: 0;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    flex-direction: column;
  }
`;

const NavListItem = styled.li`
  display: block;
`;

const Header = styled.header`
  background: #202020 url(${testBackground}) repeat;
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;

  @media only screen and (min-width: ${breakpoints.mid}) {
    background: var(--color-content-background);
    grid-column: 2 / 3;
    grid-row: 2 /3;
    padding: 20px 30px 25px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    flex-direction: column;
    justify-content: flex-start;
    margin: 0 60px 0 0;
    max-width: 200px;
    order: 2;
    padding: 0;
  }
`;

const NavLink = styled(Link)`
  border-bottom: 1px solid var(--color-border);
  clear: both;
  color: var(--color-text-secondary);
  display: block;
  line-height: 49px;
  margin: 0;
  padding: 0;
  text-decoration: none;

  @media only screen and (min-width: ${breakpoints.mid}) and (max-width: ${breakpoints.max}) {
    border-bottom: none;
    line-height: inherit;
    margin: 0;
    padding: 0;

    :nth-of-type(1) {
      margin-left: 10px;
    }

    :last-of-type {
      margin-right: 10px;
    }
  }
`;

const TextInputWrap = styled.div`
  width: 100%;

  @media only screen and (min-width: ${breakpoints.mid}) and (max-width: ${breakpoints.max}) {
    padding: 8px 0 0;
  }
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
`;

const ContentWrap = styled.div`
  background: var(--color-content-background);
  flex: 1;

  @media only screen and (min-width: ${breakpoints.mid}) {
    grid-column: 1;
    grid-row: 2 /3;

    &:after {
      clear: both;
      content: "";
      display: block;
    }
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    padding-left: 60px;
  }
`;

const Footer = styled.footer`
  background: #202020 url(${background}) repeat;
  font-size: 14px;
  font-weight: 900;
  margin: 0 auto;
  padding: 24px;
  width: 100%;

  @media only screen and (min-width: ${breakpoints.max}) {
    order: 2;
  }
`;

const FooterList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 auto 24px;
  padding: 0;
`;

const FooterListItem = styled.li`
  display: block;
  line-height: 2;
  margin: 0;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.54);
  display: block;
  padding: 4px 12px;
  text-decoration: none;
  white-space: nowrap;
`;

const footerSubLinkMixin = css`
  color: rgba(255, 255, 255, 0.54);
  display: block;
  padding: 4px 12px;
  text-decoration: none;
`;

const FooterSubLink = styled(Link)`
  ${footerSubLinkMixin}
`;

const FooterSubExternalLink = styled.a`
  ${footerSubLinkMixin}
`;

const FooterTextInputWrap = styled.div`
  border-bottom: solid 1px var(--color-primary);
  margin: 0 auto 24px;
  max-width: 80%;

  @media only screen and (min-width: ${breakpoints.mid}) {
    max-width: 50%;
  }
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

  const [showNav, setShowNav] = React.useState(false);

  const toggleNav = (): void => {
    setShowNav(!showNav);
  };

  return (
    <LayoutWrap>
      <Helmet>
        <html lang="en-US" />
        <title>{title}</title>
      </Helmet>
      <Global styles={cssVars} />
      <Global styles={cssReset} />
      <Header>
        <LogoHeading>
          <LogoLink to="/">
            <Logo />
          </LogoLink>
        </LogoHeading>
        <MenuToggle onClick={toggleNav} aria-expanded={showNav}>
          <Hamburger />
        </MenuToggle>
        <Nav role="navigation" className={showNav ? "open" : undefined}>
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
              <NavLink to="/to-watch/">To-Watch</NavLink>
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
      </Header>
      <ContentWrap>{children}</ContentWrap>
      <Footer>
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
