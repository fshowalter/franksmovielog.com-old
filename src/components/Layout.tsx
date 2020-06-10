import { Link } from "gatsby";
import React, { ReactNode } from "react";
import { Helmet } from "react-helmet";

import { css } from "@emotion/core";
import styled from "@emotion/styled";

const Header = styled.header``;

const LogoHeading = styled.h1``;

const LogoLink = styled(Link)``;

const Tagline = styled.p``;

const HeaderNav = styled.nav``;

const HeaderNavHeading = styled.h2``;

const HeaderNavList = styled.ul``;

const HeaderNavListItem = styled.li``;

const HeaderNavListItemLink = styled(Link)``;

const Footer = styled.footer``;

const Copyright = styled.p``;

const ToTheTop = styled.a``;

const ImageNotice = styled.p``;

function SearchForm(): JSX.Element {
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
      <input type="text" aria-label="search" name="q" placeholder="Search" />
    </form>
  );
}

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

export default function Layout({
  pageTitle,
  children,
}: LayoutProps): JSX.Element {
  const title = pageTitle
    ? `${pageTitle} | Frank's Movie Log`
    : `Frank's Movie Log`;

  return (
    <>
      <Helmet>
        <html lang="en-US" />
        <title>{title}</title>
      </Helmet>
      <Header id="site-header">
        <LogoHeading>
          <LogoLink to="/">Frank&apos;s Movie Log</LogoLink>
        </LogoHeading>
        <Tagline>
          Quality movie reviews of movies of questionable quality.
        </Tagline>
        <HeaderNav role="navigation">
          <HeaderNavHeading>Navigation</HeaderNavHeading>
          <HeaderNavList>
            <HeaderNavListItem>
              <HeaderNavListItemLink to="/">Home</HeaderNavListItemLink>
            </HeaderNavListItem>
            <HeaderNavListItem>
              <HeaderNavListItemLink to="/about/">About</HeaderNavListItemLink>
            </HeaderNavListItem>
            <HeaderNavListItem>
              <HeaderNavListItemLink to="/how-i-grade/">
                How I Grade
              </HeaderNavListItemLink>
            </HeaderNavListItem>
            <HeaderNavListItem>
              <HeaderNavListItemLink to="/reviews/">
                Reviews
              </HeaderNavListItemLink>
            </HeaderNavListItem>
            <HeaderNavListItem>
              <HeaderNavListItemLink to="/viewings/">
                Viewings
              </HeaderNavListItemLink>
            </HeaderNavListItem>
            <HeaderNavListItem>
              <HeaderNavListItemLink to="/to-watch/">
                To-Watch
              </HeaderNavListItemLink>
            </HeaderNavListItem>
            <HeaderNavListItem>
              <HeaderNavListItemLink to="/stats/">Stats</HeaderNavListItemLink>
            </HeaderNavListItem>
          </HeaderNavList>
          <SearchForm />
        </HeaderNav>
      </Header>
      {children}
      <Footer>
        <Copyright>© 2020 Frank Showalter</Copyright>
        <ImageNotice>
          All stills used in accordance with the{" "}
          <a href="http://www.copyright.gov/title17/92chap1.html#107">
            Fair Use Law
          </a>
          .
        </ImageNotice>
        <ToTheTop href="#site-header">To the top ↑</ToTheTop>
      </Footer>
    </>
  );
}
