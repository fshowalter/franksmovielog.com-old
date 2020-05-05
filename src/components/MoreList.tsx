import { Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import React from "react";

import styled from "@emotion/styled";

import Grade from "./Grade";

const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style-type: none;
  margin: 0;
  padding: 0;

  &:after {
    clear: both;
    content: "";
    display: table;

    @media only screen and (min-width: 48em) {
      display: none;
    }
  }
`;

const Title = styled.div`
  color: var(--color-text-primary);
  display: block;
  font-family: "Charter", "Georgia", "Times New Roman", Times, serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 3px;
  text-rendering: optimizeLegibility;
  width: 95%;
`;

const ImageWrap = styled(Link)`
  position: relative;
`;

const ListItemWrap = styled.div`
  display: block;
  padding: 0 10px 30px;

  @media only screen and (min-width: 48em) {
    padding-bottom: 0;
  }
`;

const ListItem = styled.li`
  display: block;
  width: 50%;

  &:first-of-type {
    ${ListItemWrap} {
      padding-left: 0;
    }
  }

  &:last-of-type {
    ${ListItemWrap} {
      padding-right: 0;
    }
  }

  @media only screen and (min-width: 48em) {
    &:nth-of-type(odd) {
      ${ListItemWrap} {
        padding-left: 0;
      }
    }

    &:nth-of-type(even) {
      ${ListItemWrap} {
        padding-right: 0;
      }
    }
  }

  @media only screen and (min-width: 48em) {
    ${ListItemWrap} {
      padding: 0;
    }
  }

  @media only screen and (min-width: 48em) {
    width: 23.5%;
  }

  @media only screen and (min-width: 71.25em) {
    width: 200px;
  }
`;

type ReviewNode = Props["nodes"][0];

function imageForNode(node: ReviewNode): JSX.Element | null {
  if (!node.markdown.backdrop || !node.markdown.backdrop.childImageSharp) {
    return null;
  }

  return (
    <Img
      fluid={node.markdown.backdrop?.childImageSharp?.fluid}
      alt={`A still from ${node.movie.title}`}
      loading="eager"
    />
  );
}

const StyledGrade = styled(Grade)`
  display: block;
  margin-left: -0.5px;
  max-width: 90px;
  width: 50%;

  @media only screen and (min-width: 48em) {
    max-width: 75px;
  }
`;

interface Props {
  nodes: {
    grade: string;
    sequence: number;
    slug: string;
    movie: {
      title: string;
    };
    markdown: {
      backdrop?: {
        childImageSharp?: {
          fluid: FluidObject;
        };
      };
    };
  }[];
}

export default function MoreList({ nodes }: Props): JSX.Element {
  return (
    <List>
      {nodes.map((node) => (
        <ListItem key={node.sequence}>
          <ListItemWrap>
            <ImageWrap to={`/reviews/${node.slug}/`}>
              {imageForNode(node)}
            </ImageWrap>
            <Title>{node.movie.title}</Title>
            <StyledGrade grade={node.grade} width={90} height={18} />
          </ListItemWrap>
        </ListItem>
      ))}
    </List>
  );
}
