import React from "react";

import styled from "@emotion/styled";

const ListItem = styled.li`
  font-weight: normal;
  list-style-type: none;
  padding: 0;
  position: relative;

  &:after {
    background-color: #eee;
    bottom: 0;
    content: "";
    display: block;
    height: 1px;
    left: 20px;
    margin: 0;
    position: absolute;
    right: 0;
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
`;

const Slug = styled.div`
  color: rgba(0, 0, 0, 0.38);
  font-size: 15px;
  line-height: 20px;
  padding: 0 20px 20px;
  text-rendering: optimizeLegibility;
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
