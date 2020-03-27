import React from "react";
import styled from "@emotion/styled";
import { Link } from "gatsby";

const styleVars = {
  colorMastNavLink: "#c9c4b3",
  colorMastBackground: "#222",
  colorSearchButtonBackground: "#1f1f1f",
  colorSearchButtonBorder: "#444"
};

const Header = styled.header`
  height: 40px;
  overflow: hidden;
  position: relative;
`;

const NavWrap = styled.div`
  background: ${styleVars.colorMastBackground};
  height: 100%;
  margin: 0 auto;
  max-width: 1000px;
  position: relative;
`;

const Nav = styled.ul`
  color: ${styleVars.colorMastNavLink};
  display: flex;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.1em;
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-transform: uppercase;

  a {
    color: inherit;
  }

  @media only screen and (min-width: 40.625em) {
    margin-left: 98px;
  }
`;

const NavItem = styled.li`
  line-height: 40px;
  margin: 0 10px;
`;

const NavLink = styled(Link)`
  display: inline-block;
  position: relative;

  &.active {
    color: var(--color-content-background);

    &:after {
      background: var(--color-primary);
      bottom: 0;
      content: "";
      height: 5px;
      left: 0;
      position: absolute;
      right: 0;
    }
  }
`;

const TitleWrap = styled.div`
  background: var(--color-content-background);
  border-bottom: 2px solid var(--color-primary);
  margin: 0 auto;
  max-width: 1000px;
  padding: 30px 20px 30px 75px;
  position: relative;

  @media only screen and (min-width: 40.625em) {
    padding-left: 110px;
    padding-right: 110px;
  }
`;

const Title = styled.h1`
  display: inline-block;
  font-size: 26px;
  font-style: normal;
  line-height: 1.2;
  margin: 0;
  padding: 0;

  @media only screen and (min-width: 40.625em) {
    font-size: 32px;
  }
`;

const TitleLink = styled(Link)`
  color: inherit;

  &:before {
    background: ${styleVars.colorMastBackground};
    border-radius: 50%;
    color: var(--color-content-background);
    content: "M";
    font-size: 27px;
    height: 42px;
    left: 16px;
    line-height: 42px;
    position: absolute;
    text-align: center;
    top: 35px;
    width: 42px;
  }

  @media only screen and (min-width: 40.625em) {
    &:before {
      border-radius: 50%;
      font-size: 32px;
      height: 52px;
      left: 35px;
      line-height: 52px;
      top: 35px;
      width: 52px;
    }
  }
`;

const SubTitle = styled.div`
  color: var(--color-text-secondary);
  display: block;
  font-size: 16px;
  line-height: 1.2;
  margin-left: 0.5px;

  @media only screen and (min-width: 40.625em) {
    font-size: 18px;

    .nowrap {
      white-space: nowrap;
    }
  }
`;

const Mast = ({ children }) => {
  return (
    <>
      <Header>
        <NavWrap>
          <Nav>
            <NavItem>
              <NavLink to="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/reviews/">Reviews</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/how-i-grade/">How I Grade</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/viewings/">Viewing Log</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/watchlist/">Watchlist</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/metrics/">Metrics</NavLink>
            </NavItem>
          </Nav>
        </NavWrap>
      </Header>
      <TitleWrap>
        <Title>
          <TitleLink to="/">Frank's Movie Log</TitleLink>
        </Title>
        <SubTitle>Quality reviews of films of questionable quality.</SubTitle>
      </TitleWrap>
    </>
  );
};

export default Mast;
