import { Link } from 'gatsby';
import React from 'react';

import styled from '@emotion/styled';

const styleVars = {
  colorFooterBackground: "#222",
  colorFooterLink: "#717171",
  colorFooterSubLink: "#b5b5b5",
};

const Footer = styled.footer`
  background-color: ${styleVars.colorFooterBackground};
  margin: 0 auto;
  max-width: 1000px;
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
  text-rendering: optimizeLegibility;
  white-space: nowrap;
`;

const FooterSubLink = styled(Link)`
  color: ${styleVars.colorFooterSubLink};
  font-size: 13px;
  letter-spacing: 0.3px;
  text-rendering: optimizeLegibility;
`;

export default () => {
  return (
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
          <FooterLink to="/cast-and-crew/">Cast & Crew</FooterLink>
        </FooterListItem>
        <FooterListItem>
          <FooterLink to="/viewings/">Viewing Log</FooterLink>
        </FooterListItem>
        <FooterListItem>
          <FooterLink to="/stats/">Stats</FooterLink>
        </FooterListItem>
      </FooterList>
      <FooterList>
        <FooterListItem>
          <FooterSubLink to="https://letterboxd.com/frankshowalter/">
            Letterboxd
          </FooterSubLink>
        </FooterListItem>
        <FooterListItem>
          <FooterSubLink to="/feed.xml">RSS</FooterSubLink>
        </FooterListItem>
      </FooterList>
    </Footer>
  );
};
