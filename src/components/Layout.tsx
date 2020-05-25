import { Link } from "gatsby";
import React, { ReactNode } from "react";
import { Helmet } from "react-helmet";

import { css, Global } from "@emotion/core";
import styled from "@emotion/styled";

import testBackground from "../assets/background.jpg";
import background from "../assets/bkg_dark.png";
import close from "../assets/close.inline.svg";
import hamburger from "../assets/hamburger.inline.svg";
import logo from "../assets/logo.inline.svg";
import menu from "../assets/menu.inline.svg";
import search from "../assets/search.inline.svg";

export const breakpoints: { mid: string; max: string } = {
  mid: "1000px",
  max: "1200px",
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
  }

  a {
    color: var(--color-link);
    line-height: inherit;
    text-decoration: none;
  }

  body {
    /* background: var(--color-primary); */
    box-sizing: border-box;
    color: var(--color-text-primary);
    font-family: var(--font-family-system);
    -webkit-font-smoothing: antialiased;
    font-style: normal;
    font-weight: 500;
    line-height: 1.61803398875;
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
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
`;

const LogoHeading = styled.h1`
  font-size: 22px;
  font-weight: 900;
  /* letter-spacing: -0.5px; */
  line-height: 1;
  margin: 0;
  padding: 0;

  @media only screen and (min-width: ${breakpoints.mid}) {
    font-size: 26px;
  }
`;

const Logo = styled(logo)`
  background-color: transparent;
  fill: transparent;
  height: 50px;
  width: 50px;

  @media only screen and (min-width: ${breakpoints.mid}) {
    background: #202020 url(${testBackground}) repeat;
    /* background: #222; */
    height: 70px;
    margin-right: 24px;
    width: 70px;
    margin-right: 1rem;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    margin-right: 0;
  }
`;

const LogoLink = styled(Link)`
  color: #fff;
  /* display: flex;
  flex-direction: column;
  height: 56px;
  justify-content: center;
  margin-left: 14px; */

  @media only screen and (min-width: ${breakpoints.mid}) {
    margin: 0;
  }
`;

const Hamburger = styled(hamburger)`
  background-color: transparent;
  fill: #000;
  height: 25px;
  margin-bottom: 5px;
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

const Search = styled(search)`
  background-color: transparent;
  display: block;
  fill: #fff;
  height: 25px;
  /* margin: 0 10px 0 15px; */
  /* stroke: #000; */
  width: 23px;
`;

const Menu = styled(menu)`
  background-color: transparent;
  display: block;
  fill: #fff;
  height: 26px;
  /* margin: 0 10px 0 15px; */
  /* stroke: #000; */
  width: 23px;
`;

const Close = styled(close)`
  background-color: transparent;
  display: block;
  fill: var(--color-text-primary);
  height: 16px;
  /* margin: 0 10px 0 15px; */
  /* stroke: #000; */
  width: 24px;
`;

const CloseSearch = styled(close)`
  background-color: transparent;
  display: block;
  fill: var(--color-text-primary);
  height: 16px;
  /* margin: 0 10px 0 15px; */
  /* stroke: #000; */
  width: 24px;
`;

const SearchToggle = styled.button`
  display: none;

  @media only screen and (min-width: ${breakpoints.mid}) {
    align-items: center;
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 30px;
    padding: 0 0 0 24px;
    position: relative;

    &:before {
      background: var(--color-border);
      content: "";
      display: block;
      height: 27px;
      left: 0;
      position: absolute;
      width: 1px;
    }
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
  padding: 0 24px;
  position: absolute;
  right: 0;
  top: 0;

  @media only screen and (min-width: ${breakpoints.mid}) {
    display: none;
  }
`;

const CloseNav = styled.button`
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-border);
  border-radius: 0;
  box-shadow: none;
  display: flex;
  justify-content: flex-end;
  padding: 27px 24px;
  width: 100%;

  @media only screen and (min-width: ${breakpoints.mid}) {
    display: none;
  }
`;

const CloseSearchButton = styled.button`
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-border);
  border-radius: 0;
  box-shadow: none;
  display: flex;
  justify-content: flex-end;
  padding: 27px 24px;
  width: 100%;

  @media only screen and (min-width: ${breakpoints.mid}) {
    display: none;
  }
`;

const Nav = styled.nav`
  background: #fff;
  box-sizing: border-box;
  height: 100vh;
  left: 0;
  opacity: 0;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.2s;
  visibility: hidden;
  z-index: 200;

  &.open {
    opacity: 1;
    visibility: visible;
  }

  @media only screen and (min-width: ${breakpoints.mid}) {
    background: none;
    display: flex;
    height: auto;
    opacity: 1;
    padding: 0;
    position: relative;
    top: auto;
    visibility: visible;
  }
`;

const NavList = styled.ul`
  margin: 0 24px 24px;
  padding: 0;

  @media only screen and (min-width: ${breakpoints.mid}) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin: 0;
  }
`;

const NavListItem = styled.li`
  display: block;
`;

const Header = styled.header`
  background-color: var(--color-text-primary);
  width: 100%;
`;

const NavLink = styled(Link)`
  border-bottom: 1px solid var(--color-border);
  display: block;
  font-size: 16px;
  font-weight: 700;
  line-height: auto;
  margin: 0;
  padding: 0;
  text-decoration: none;

  &.active {
    color: rgba(255, 255, 255, 0.54);
  }

  @media only screen and (min-width: ${breakpoints.mid}) {
    border-bottom: none;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    line-height: 26px;
    margin: 0;

    :nth-of-type(1) {
      margin-left: 1rem;
    }

    :last-of-type {
      margin-right: 0;
    }
  }
`;

const TextInputWrap = styled.div`
  margin: 0 24px;
  width: calc(100% - 48px);

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
  margin: 0 auto;
  max-width: 1000px;

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
    /* padding-left: 60px; */
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

const StyledSearchForm = styled.form`
  @media only screen and (min-width: ${breakpoints.mid}) {
    opacity: 0;
    position: absolute;
    visibility: hidden;
  }
`;

interface SearchFormProps {
  children: ReactNode;
}

function SearchForm({ children }: SearchFormProps): JSX.Element {
  return (
    <StyledSearchForm
      action="https://www.google.com/search"
      acceptCharset="UTF-8"
      method="get"
    >
      <input type="hidden" name="q" value="site:www.franksmovielog.com" />
      {children}
    </StyledSearchForm>
  );
}

const ButtonLabel = styled.span`
  bottom: 13px;
  color: rgba(255, 255, 255, 0.54);
  display: block;
  font-family: var(--font-family-system);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.61803398875;

  @media only screen and (min-width: ${breakpoints.mid}) {
    font-size: 14px;
    font-weight: 400;
  }
`;

const CloseNavLabel = styled.span`
  color: var(--color-text-primary);
  display: block;
  font-size: 1rem;
  font-weight: normal;
  line-height: 1;
  margin-right: 1rem;
`;

const LogoSlug = styled.span`
  color: rgba(255, 255, 255, 0.54);
  font-size: 10px;
  font-weight: 600;

  @media only screen and (min-width: ${breakpoints.mid}) {
    font-size: 14px;
    font-weight: 400;
  }
`;

const LogoWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and (min-width: ${breakpoints.mid}) {
    width: 50%;
  }
`;

const HeaderWrap = styled.div`
  display: flex;
  justify-content: left;
  margin: 0 auto;
  max-width: 1048px;
  padding: 14px 24px;
  position: relative;

  @media only screen and (min-width: ${breakpoints.mid}) {
    justify-content: space-between;
  }
`;

const SearchWrap = styled.div``;

interface Props {
  children: ReactNode;
  pageTitle?: string;
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
    <LayoutWrap>
      <Helmet>
        <html lang="en-US" />
        <title>{title}</title>
      </Helmet>
      <Global styles={cssVars} />
      <Global styles={cssReset} />
      <Header>
        <HeaderWrap>
          <LogoWrap>
            <LogoHeading>
              <LogoLink to="/">Frank&apos;s Movie Log</LogoLink>
            </LogoHeading>
            <LogoSlug>
              Quality reviews of films of questionable quality.
            </LogoSlug>
          </LogoWrap>
          <MenuToggle onClick={toggleNav} aria-expanded={navVisible}>
            <Menu />
            <ButtonLabel>Menu</ButtonLabel>
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
                  Viewing Log
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
            <SearchToggle onClick={toggleNav} aria-expanded={navVisible}>
              <Search />
              <ButtonLabel>Search</ButtonLabel>
            </SearchToggle>
            <SearchForm>
              <TextInputWrap>
                <TextInput aria-label="search" name="q" placeholder="Search" />
              </TextInputWrap>
              <CloseSearchButton onClick={toggleNav}>
                <CloseSearch />
              </CloseSearchButton>
            </SearchForm>
          </Nav>
        </HeaderWrap>
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
