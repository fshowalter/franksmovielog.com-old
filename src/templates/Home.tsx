import { graphql } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import React, { memo } from "react";

import styled from "@emotion/styled";

import Layout from "../components/Layout";
import SingleColumn from "../components/SingleColumn";

const ReviewList = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ReviewListItem = styled.li`
  margin: 0 0 25px;
  padding: 0;

  &:after {
    background-color: $color_primary;
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
      .home_review_list-header {
        float: right;
        padding-left: 20px;
        width: 66%;
      }

      .home_review_list-backdrop_wrap {
        float: left;
        margin: 0;
        width: 33%;
      }

      .home_review_list-excerpt {
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
            slug: string;
            backdrop?: {
              childImageSharp?: {
                fluid: FluidObject;
              };
            };
          };
          frontmatter: {
            title: string;
            sequence: number;
          };
        };
      }[];
    };
  };
}

const imageForNode = (
  node: Props["data"]["allMarkdownRemark"]["edges"][0]["node"]
) => {
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

const HomeTemplate: React.FC<Props> = ({ data }) => {
  return (
    <Layout>
      <SingleColumn>
        <ReviewList>
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <ReviewListItem key={node.frontmatter?.sequence}>
              {imageForNode(node)}
              {node.frontmatter?.title}
            </ReviewListItem>
          ))}
        </ReviewList>
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
            slug
            backdrop {
              childImageSharp {
                fluid(toFormat: JPG, jpegQuality: 75) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          frontmatter {
            title
            sequence
          }
        }
      }
    }
  }
`;
