import React from "react";

import styled from "@emotion/styled";

import { breakpoints } from "./Layout";

const ListItem = styled.li`
  font-weight: normal;
  list-style-type: none;
  padding: 0;
  position: relative;

  &:after {
    background-color: #d8d8d8;
    bottom: 0;
    content: "";
    display: block;
    height: 0.1rem;
    left: 2rem;
    margin: 0;
    position: absolute;
    right: 0;
  }

  /* @media only screen and (min-width: ${breakpoints.mid}) {
    margin: 0;

    &:after {
      left: 0;
    }
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    margin: 0;
  } */
`;

const Title = styled.div`
  display: block;
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1.388888889;
  padding: 3rem 2rem 0;
`;

const Slug = styled.div`
  color: #6d6d6d;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 20px;
  padding: 0.5rem 2rem 2rem;
  text-rendering: optimizeLegibility;
`;

const Year = styled.span`
  color: var(--color-text-secondary);
  font-size: 1.3rem;
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
  padding: 0 0 6rem;

  /* @media only screen and (min-width: ${breakpoints.mid}) {
    padding: 0 1rem 60px 30px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    border-right: solid 1px var(--color-border);
    padding-left: 60px;
  } */
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
