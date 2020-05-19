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
  color: var(--color-text-heading);
  display: block;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 3px;
  text-rendering: optimizeLegibility;
  width: 95%;
`;

const ImageWrap = styled(Link)`
  display: block;
  margin-bottom: 3px;
  position: relative;
`;

const ListItemWrap = styled.div`
  display: block;
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
