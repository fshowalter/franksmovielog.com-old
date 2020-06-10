import React from "react";

import styled from "@emotion/styled";

const ListItem = styled.li``;

const Title = styled.div``;

const Slug = styled.div``;

const Year = styled.span``;

interface TitleListItem {
  title: string;
  year: string;
  slug: string;
  visible: boolean;
}

export const TitleList = styled.ol``;

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
