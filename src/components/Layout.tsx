import { Link } from "gatsby";
import React, { ReactNode } from "react";

import { css, Global } from "@emotion/core";
import styled from "@emotion/styled";

import hamburger from "../assets/hamburger.inline.svg";
import mobileBackground from "../assets/imissnotcomingsoon.jpg";
import logo from "../assets/logo.inline.svg";
import Footer from "./Footer";

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
  margin-left: 10px;
  width: 50px;

  @media only screen and (min-width: 48em) {
    background: #202020 url(${mobileBackground}) repeat;
    height: 70px;
    left: 0;
    margin-left: 0;
    position: absolute;
    top: 11px;
    width: 70px;
  }

  @media only screen and (min-width: 71.25em) {
    margin: 0 0 40px;
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

  [aria-expanded="true"] & rect:nth-child(1) {
    transform: rotate(45deg);
  }
  [aria-expanded="true"] & rect:nth-child(2) {
    opacity: 0;
    width: 0;
  }
  [aria-expanded="true"] & rect:nth-child(3) {
    opacity: 0;
    width: 0;
  }

  [aria-expanded="true"] & rect:nth-child(4) {
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
  background: #fff;
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
    background: #fff;
    box-sizing: border-box;
    margin: 0 auto;
    max-width: 700px;
    padding-left: 90px;

    &::after {
      background-color: #eee;
      clear: both;
      content: "";
      display: block;
      height: 1px;
      margin: 40px 20px 0;

      @media only screen and (min-width: 71.25em) {
        display: none;
      }
    }
  }

  @media only screen and (min-width: 71.25em) {
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
  margin: 0;
  padding: 10px 0;
  text-decoration: none;

  @media only screen and (min-width: 48em) and (max-width: 71.24em) {
    border-bottom: none;
    display: inline-block;
    margin-right: 20px;
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
  }

  @media only screen and (min-width: 71.25em) {
    flex-basis: 900px;
    max-width: 900px;
    order: 1;
  }
`;

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
            <Link to="/">
              <Logo />
            </Link>
            <MenuWrap className="js-toggle js-toggle_off" id="menu">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/">How I Grade</NavLink>
              <NavLink to="/">Reviews</NavLink>
              <NavLink to="/">Viewing Log</NavLink>
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
