import { Link } from "gatsby";
import React from "react";

import { css } from "@emotion/core";
import styled from "@emotion/styled";

import background from "../assets/bkg_dark.png";

const styleVars = {
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
  color: ${styleVars.colorFooterLink};
  font-size: 15px;
  letter-spacing: 0.3px;
  text-decoration: none;
  text-rendering: optimizeLegibility;
  white-space: nowrap;
`;

const footerSubLinkMixin = css`
  color: ${styleVars.colorFooterSubLink};
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

const TextInputWrap = styled.div`
  border-bottom: solid 1px var(--color-primary);
  margin: 0 auto 10px;
  max-width: 180px;
`;

const TextInput = styled.input`
  backface-visibility: hidden;
  background-color: rgba(255, 255, 255, 0.3);
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

interface Props {
  className?: string;
}

export default function Footer({ className }: Props): JSX.Element {
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
      <TextInputWrap>
        <TextInput placeholder="Search" />
      </TextInputWrap>
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
