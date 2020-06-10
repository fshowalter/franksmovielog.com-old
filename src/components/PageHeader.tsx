import React from "react";

import styled from "@emotion/styled";

const Header = styled.header``;

const Heading = styled.h1``;

const Slug = styled.p``;

interface PageHeaderProps {
  className?: string;
  heading: string;
  slug: string;
}

export default function PageHeader({
  className,
  heading,
  slug,
}: PageHeaderProps): JSX.Element {
  return (
    <Header className={className}>
      <Heading>{heading}</Heading>
      <Slug>{slug}</Slug>
    </Header>
  );
}
