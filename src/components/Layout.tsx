import { Link } from "gatsby";
import React, { ReactNode } from "react";

import { css, Global } from "@emotion/core";
import styled from "@emotion/styled";

import background from "../assets/bkg_dark.png";
import hamburger from "../assets/hamburger.inline.svg";
import mobileBackground from "../assets/imissnotcomingsoon.jpg";
import logo from "../assets/logo.inline.svg";

const LayoutWrap = styled.div`
  @media only screen and (min-width: 71.25em) {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    max-width: 1100px;
  }
`;

const Logo = styled(logo)`
  background-color: transparent;
  fill: transparent;
  height: 50px;
  width: 50px;

  @media only screen and (min-width: 48em) {
    background: #202020 url(${mobileBackground}) repeat;
    height: 70px;
    width: 70px;
  }
`;

const LogoLink = styled(Link)`
  display: inline-block;
  margin-left: 10px;

  @media only screen and (min-width: 48em) {
    left: 0;
    margin-left: 0;
    position: absolute;
    top: 11px;
  }

  @media only screen and (min-width: 71.25em) {
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

const MenuWrap = styled.div`
  background: transparent;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 300;
  height: calc(100vh - 56px);
  letter-spacing: 1px;
  opacity: 1;
  padding: 20px 20px 40px;
  position: absolute;
  transition: opacity 0.2s;
  visibility: visible;
  width: 100%;
  z-index: 200;

  &.js-toggle_off {
    opacity: 0;
    visibility: hidden;
  }

  @media only screen and (min-width: 48em) {
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

const HeaderWrap = styled.div`
  @media only screen and (min-width: 71.25em) {
    order: 2;
  }
`;

const Header = styled.header`
  background: #202020 url(${mobileBackground}) repeat;
  margin: 0;
  max-width: 150px;

  max-width: 900px;
  opacity: 1;
  position: relative;
  top: 0;
  z-index: 100;

  @media only screen and (min-width: 48em) {
    background: transparent;
    box-sizing: border-box;
    margin: 0 auto;
    max-width: 700px;
    padding-left: 90px;
  }

  @media only screen and (min-width: 71.24em) {
    border-left: solid 1px #eee;
    margin-left: 25px;
    margin-top: 20px;
    max-width: 175px;
    order: 2;
    padding: 0 0 20px 25px;
  }
`;

const NavLink = styled(Link)`
  border-bottom: 1px solid #eee;
  clear: both;
  color: inherit;
  display: block;
  line-height: 49px;
  margin: 0;
  padding: 0;
  text-decoration: none;

  @media only screen and (min-width: 48em) and (max-width: 71.24em) {
    border-bottom: none;
    display: inline-block;
    line-height: inherit;
    margin-right: 20px;
    padding: 10px 0;
  }
`;

const TextInputWrap = styled.div`
  margin-top: 20px;
  width: 100%;

  @media only screen and (min-width: 48em) and (max-width: 71.24em) {
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
  @media only screen and (min-width: 48em) {
    margin: 0 auto;
    max-width: 700px;
    padding: 20px 0;
  }

  @media only screen and (min-width: 71.25em) {
    flex-basis: 900px;
    max-width: 900px;
    order: 1;
  }
`;

const footerStyleVars = {
  colorFooterBackground: "#202020",
  colorFooterLink: "#717171",
  colorFooterSubLink: "#b5b5b5",
};

const FooterWrap = styled.footer`
  background: #202020 url(${background}) repeat;
  margin: 0 auto;
  padding: 40px 20px 60px;
`;

const FooterList = styled.ul`
  line-height: 1.75;
  margin: 0 0 10px;
  padding: 0;
  text-align: center;
`;

const FooterListItem = styled.li`
  display: inline-block;
  padding: 0 8px;
`;

const FooterLink = styled(Link)`
  color: ${footerStyleVars.colorFooterLink};
  font-size: 15px;
  letter-spacing: 0.3px;
  text-decoration: none;
  text-rendering: optimizeLegibility;
  white-space: nowrap;
`;

const footerSubLinkMixin = css`
  color: ${footerStyleVars.colorFooterSubLink};
  font-size: 13px;
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

interface FooterProps {
  className?: string;
}

function Footer({ className }: FooterProps): JSX.Element {
  return (
    <FooterWrap className={className}>
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
          <FooterLink to="/cast-and-crew/">Watchlist</FooterLink>
        </FooterListItem>
        <FooterListItem>
          <FooterLink to="/stats/">Stats</FooterLink>
        </FooterListItem>
      </FooterList>
      <FooterTextInputWrap>
        <TextInput placeholder="Search" />
      </FooterTextInputWrap>
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
    </FooterWrap>
  );
}

const StyledFooter = styled(Footer)`
  @media only screen and (min-width: 71.25em) {
    flex-basis: 100%;
    order: 3;
  }
`;

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props): JSX.Element {
  return (
    <>
      <LayoutWrap>
        <Global
          styles={css`
            body,
            html {
              font-size: 16px;
            }

            body {
              color: rgba(0, 0, 0, 0.87);
              font-family: "Charter", "Iowan Old Style", Georgia, Cambria,
                "Times New Roman", Times, serif;
              -webkit-font-smoothing: antialiased;
              font-style: normal;
              font-weight: 500;
              line-height: 24px;

              /* background: #e9e7e0; */
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
              color: #222;
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
          `}
        />
        <HeaderWrap>
          <Header>
            <LogoLink to="/">
              <Logo />
            </LogoLink>
            <MenuWrap className="js-toggle js-toggle_off" id="menu">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/about/">About</NavLink>
              <NavLink to="/how-i-grade/">How I Grade</NavLink>
              <NavLink to="/">Reviews</NavLink>
              <NavLink to="/viewings/">Viewing Log</NavLink>
              <NavLink to="/">Watchlist</NavLink>
              <NavLink to="/">Stats</NavLink>
              <TextInputWrap>
                <TextInput placeholder="Search" />
              </TextInputWrap>
            </MenuWrap>
            <MenuToggle data-toggle="true" data-toggle-target="menu">
              <Hamburger />
            </MenuToggle>
          </Header>
        </HeaderWrap>
        <ContentWrap>{children}</ContentWrap>
      </LayoutWrap>
      <StyledFooter />
    </>
  );
}
