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
    margin: 0 30px 0 30px;
    max-width: 480px;

    &:after {
      left: 0;
      right: 20px;
    }
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    margin: 0 60px;
  }
`;

const Title = styled.div`
  display: block;
  font-size: 18px;
  line-height: 40px;
  overflow: hidden;
  padding: 20px 20px 0;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media only screen and (min-width: ${breakpoints.mid}) {
    padding: 20px 0 0;
  }
`;

const Slug = styled.div`
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 20px;
  padding: 0 20px 20px;
  text-rendering: optimizeLegibility;

  @media only screen and (min-width: ${breakpoints.mid}) {
    padding: 0 0 20px;
  }
`;

interface ListItemWithSlugProps {
  title: string;
  slug: string;
  visible: boolean;
}

export default function ListItemWithSlug({
  title,
  slug,
  visible,
}: ListItemWithSlugProps): JSX.Element {
  const style = visible ? undefined : { display: "none" };

  return (
    <ListItem style={style}>
      <Title>{title}</Title>
      <Slug>{slug}</Slug>
    </ListItem>
  );
}
