import Img, { FluidObject } from 'gatsby-image';
import React, { memo } from 'react';

import styled from '@emotion/styled';

import Grade from '../components/Grade';

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

    @media only screen and (min-width: 35em) {
      display: none;
    }
  }
`;

const Title = styled.div`
  color: var(--color-text-primary);
  display: block;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 3px;
  text-rendering: optimizeLegibility;
  width: 95%;
`;

const ImageWrap = styled.span`
  position: relative;
`;

const ListItemWrap = styled.div`
  display: block;
  padding: 0 10px 30px;

  @media only screen and (min-width: 35em) {
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

  @media only screen and (max-width: 34.9375em) {
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

  @media only screen and (min-width: 35em) {
    ${ListItemWrap} {
      padding: 0;
    }
  }

  @media only screen and (min-width: 35em) {
    width: 23.5%;
  }
`;

type ReviewNode = Props["nodes"][0];

const imageForNode = (node: ReviewNode) => {
  if (!node.fields.backdrop || !node.fields.backdrop.childImageSharp) {
    return null;
  }

  return (
    <Img
      fluid={node.fields?.backdrop?.childImageSharp?.fluid}
      alt={`A still from ${node.fields.movie.title}`}
    />
  );
};

const StyledGrade = styled(Grade)`
  display: block;
  margin-left: -0.5px;
  max-width: 90px;
  width: 50%;

  @media only screen and (min-width: 35em) {
    max-width: 75px;
  }
`;

interface Props {
  nodes: {
    fields: {
      backdrop?: {
        childImageSharp?: {
          fluid: FluidObject;
        };
      };
      movie: {
        title: string;
      };
    };
    frontmatter: {
      grade: string;
      sequence: number;
    };
  }[];
}

const MoreList: React.FC<Props> = ({ nodes }) => {
  return (
    <List>
      {nodes.map((node) => (
        <ListItem key={node.frontmatter?.sequence}>
          <ListItemWrap>
            <ImageWrap>{imageForNode(node)}</ImageWrap>
            <Title>{node.fields.movie.title}</Title>
            <StyledGrade
              grade={node.frontmatter.grade}
              width={90}
              height={18}
            />
          </ListItemWrap>
        </ListItem>
      ))}
    </List>
  );
};

export default memo(MoreList);
