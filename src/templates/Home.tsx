import { graphql } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import parse from 'html-react-parser';
import React, { memo } from 'react';
import { renderToString } from 'react-dom/server';
import remark from 'remark';

import styled from '@emotion/styled';

import Grade from '../components/Grade';
import Layout from '../components/Layout';
import SingleColumn from '../components/SingleColumn';

const remarkHTML = require("remark-html");

const HomeWrap = styled.div`
  padding: 20px;

  @media only screen and (min-width: 40.625em) {
    padding: 20px 110px;
  }
`;

const List = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Review = styled.article`
  &:after {
    clear: both;
    content: "";
    display: table;
  }
`;

const ReviewDate = styled.div`
  color: var(--color-accent);
  display: block;
  font-family: var(--font-family-system);
  font-feature-settings: "tnum";
  font-size: 13px;
  font-weight: 400;
  line-height: 30px;
  margin: 0;
  text-transform: uppercase;
  width: 90px;
`;

const ReviewHeader = styled.header`
  margin: 0 0 10px;
`;

const ReviewHeading = styled.h3`
  font-size: 26px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  word-break: normal;
`;

const ReviewImageWrap = styled.span`
  background-repeat: no-repeat;
  background-size: cover;
  border: 9px solid var(--color-primary);
  display: block;
  margin: 0 0 10px;
  position: relative;

  @media only screen and (min-width: 56.25em) {
    margin-bottom: 15px;
  }
`;

const ReviewExcerpt = styled.div`
  font-feature-settings: "ordn", "lnum";
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.16px;
  line-height: 28px;
  max-width: 700px;

  @media only screen and (min-width: 56.25em) {
    padding: 0 9px;
  }
`;

const ListItem = styled.li`
  margin: 0 0 25px;
  padding: 0;

  &:after {
    background-color: var(--color-primary);
    clear: both;
    content: "";
    display: block;
    height: 1px;
    margin: 40px 0 25px;
  }

  &:last-of-type:after {
    display: none;
  }

  &:not(:first-of-type) {
    @media only screen and (min-width: 56.25em) {
      ${ReviewHeader} {
        float: right;
        padding-left: 20px;
        width: 66%;
      }

      ${ReviewImageWrap} {
        float: left;
        margin: 0;
        width: 33%;
      }

      ${ReviewExcerpt} {
        float: right;
        padding-left: 20px;
        width: 66%;
      }
    }
  }
`;

interface Props {
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          fields: {
            backdrop?: {
              childImageSharp?: {
                fluid: FluidObject;
              };
            };
            movie: {
              title: string;
              year: number;
            };
            firstParagraph: string;
          };
          frontmatter: {
            title: string;
            sequence: number;
            date: string;
            grade: string;
          };
        };
      }[];
    };
  };
}

type ReviewNode = Props["data"]["allMarkdownRemark"]["edges"][0]["node"];

const imageForNode = (node: ReviewNode) => {
  if (
    node.fields.backdrop === undefined ||
    node.fields.backdrop.childImageSharp == undefined ||
    node.fields.backdrop.childImageSharp == undefined
  ) {
    return;
  }

  return (
    <Img
      fluid={node.fields?.backdrop?.childImageSharp?.fluid}
      alt={`A still from ${node.frontmatter?.title}`}
    />
  );
};

const dateForNode = (node: ReviewNode) => {
  if (node.frontmatter === undefined || node.frontmatter.date == undefined) {
    return;
  }

  return node.frontmatter.date;
};

const StyledGrade = styled(Grade)`
  display: inline-block;
  height: auto;
  margin-right: 2px;
  position: relative;
  top: 3px;
  width: 95px;
`;

const buildExcerpt = (node: ReviewNode) => {
  let excerpt =
    renderToString(
      <StyledGrade grade={node.frontmatter.grade} width={95} height={95} />
    ) +
    " " +
    node.fields.firstParagraph;

  return parse(remark().use(remarkHTML).processSync(excerpt).toString());
};

const HomeTemplate: React.FC<Props> = ({ data }) => {
  return (
    <Layout>
      <SingleColumn>
        <HomeWrap>
          <List>
            {data.allMarkdownRemark.edges.map(({ node }) => (
              <ListItem key={node.frontmatter?.sequence}>
                <Review>
                  <ReviewDate>{dateForNode(node)}</ReviewDate>
                  <ReviewHeader>
                    <ReviewHeading>{node.fields.movie.title}</ReviewHeading>
                  </ReviewHeader>
                  <ReviewImageWrap>{imageForNode(node)}</ReviewImageWrap>
                  <ReviewExcerpt>{buildExcerpt(node)}</ReviewExcerpt>
                </Review>
              </ListItem>
            ))}
          </List>
        </HomeWrap>
      </SingleColumn>
    </Layout>
  );
};

export default memo(HomeTemplate);

export const pageQuery = graphql`
  query IndexPosts($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/reviews/" } }
      sort: { fields: [frontmatter___sequence], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            backdrop {
              childImageSharp {
                fluid(toFormat: JPG, jpegQuality: 75) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            movie {
              title
            }
            firstParagraph
          }
          frontmatter {
            title
            sequence
            date(formatString: "DD MMM YYYY")
            grade
          }
        }
      }
    }
  }
`;
