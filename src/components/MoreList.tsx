import { Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import React from "react";

import styled from "@emotion/styled";

import Grade from "./Grade";

const List = styled.ol``;

const Title = styled.div``;

const Year = styled.span``;

const ImageWrap = styled(Link)``;

const ListItemWrap = styled.div``;

const ListItem = styled.li``;

const StyledGrade = styled(Grade)``;

interface Review {
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
}

function imageForReview(review: Review): JSX.Element | null {
  if (!review.markdown.backdrop || !review.markdown.backdrop.childImageSharp) {
    return null;
  }

  return (
    <Img
      fluid={review.markdown.backdrop?.childImageSharp?.fluid}
      alt={`A still from ${review.movie.title}`}
    />
  );
}

interface Props {
  nodes: Review[];
}

export default function MoreList({ nodes }: Props): JSX.Element {
  return (
    <List>
      {nodes.map((node) => (
        <ListItem key={node.sequence}>
          <ListItemWrap>
            <ImageWrap to={`/reviews/${node.slug}/`}>
              {imageForReview(node)}
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
