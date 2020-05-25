import React from "react";

import styled from "@emotion/styled";

import { breakpoints } from "./Layout";

const ListItem = styled.li`
  font-weight: normal;
  list-style-type: none;
  padding: 0;
  position: relative;

  &:after {
    background-color: var(--color-border);
    bottom: 0;
    content: "";
    display: block;
    height: 1px;
    left: 20px;
    margin: 0;
    position: absolute;
    right: 0;
  }

  @media only screen and (min-width: ${breakpoints.mid}) {
    margin: 0;

    &:after {
      left: 0;
    }
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    margin: 0;
  }
`;

const Title = styled.div`
  color: var(--color-text-heading);
  display: block;
  font-size: 18px;
  font-weight: 900;
  padding: 34px 20px 0;

  @media only screen and (min-width: ${breakpoints.mid}) {
    padding: 20px 0 0;
  }

  @media only screen and (min-width: ${breakpoints.mid}) {
    padding: 27px 0 0;
  }
`;

const Slug = styled.div`
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 300;
  line-height: 20px;
  padding: 0 20px 20px;
  text-rendering: optimizeLegibility;

  @media only screen and (min-width: ${breakpoints.mid}) {
    font-size: 13px;
    padding: 0 0 27px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    font-size: 14px;
  }
`;

const Year = styled.span`
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 400;
`;

interface TitleListItem {
  title: string;
  year: string;
  slug: string;
  visible: boolean;
}

export const TitleList = styled.ol`
  margin: 0;
  padding: 0 0 60px;

  @media only screen and (min-width: ${breakpoints.mid}) {
    padding: 0 1rem 60px 30px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    border-right: solid 1px var(--color-border);
    /* padding-left: 60px; */
  }
`;

export function TitleListItem({
  title,
  year,
  slug,
  visible,
}: TitleListItem): JSX.Element {
  const style = visible ? undefined : { display: "none" };

  return (
    <ListItem style={style}>
      <Title>
        {title} <Year>({year})</Year>
      </Title>
      <Slug>{slug}</Slug>
    </ListItem>
  );
}
