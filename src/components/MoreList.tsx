import { Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import React from "react";

import styled from "@emotion/styled";

import Grade from "./Grade";
import { breakpoints } from "./Layout";

const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Title = styled.div`
  display: block;
  font-family: var(--font-family-system);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.3;
  margin-bottom: 3px;
  text-rendering: optimizeLegibility;
  width: 95%;

  @media only screen and (min-width: 700px) {
    font-size: 1.6rem;
  }
`;

const Year = styled.span`
  font-size: 1.1rem;
  font-weight: 300;

  @media only screen and (min-width: 700px) {
    font-size: 1.6rem;
  }
`;

const ImageWrap = styled(Link)`
  display: block;
  margin-bottom: 3px;
  position: relative;
  width: 100%;
`;

const ListItemWrap = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  padding: 0 12px 30px;

  @media only screen and (min-width: ${breakpoints.mid}) {
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

  @media only screen and (max-width: ${breakpoints.mid}) {
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

  @media only screen and (min-width: ${breakpoints.mid}) {
    ${ListItemWrap} {
      padding: 0;
    }
  }

  @media only screen and (min-width: ${breakpoints.mid}) {
    width: 23.5%;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
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
    />
  );
}

const StyledGrade = styled(Grade)`
  display: block;
  height: 1.6rem;
`;

interface Props {
  nodes: {
    grade: string;
    sequence: number;
    slug: string;
    movie: {
      title: string;
      year: string;
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
            <Title>
              {node.movie.title} <Year>{node.movie.year}</Year>
            </Title>
            <StyledGrade grade={node.grade} />
          </ListItemWrap>
        </ListItem>
      ))}
    </List>
  );
}
