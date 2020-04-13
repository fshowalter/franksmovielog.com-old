import { graphql } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import React, { memo } from "react";

import styled from "@emotion/styled";

import Layout from "../components/Layout";
import SingleColumn from "../components/SingleColumn";

const List = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
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

const Review = styled.article`
  &:after {
    clear: both;
    content: "";
    display: table;
  }
`;

const Date = styled.div`
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
            date: string;
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

const dateForNode = (
  node: Props["data"]["allMarkdownRemark"]["edges"][0]["node"]
) => {
  if (node.frontmatter === undefined || node.frontmatter.date == undefined) {
    return;
  }

  return node.frontmatter.date;
};

const HomeTemplate: React.FC<Props> = ({ data }) => {
  return (
    <Layout>
      <SingleColumn>
        <List>
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <ListItem key={node.frontmatter?.sequence}>
              <Review>
                <Date>{dateForNode(node)}</Date>
                {imageForNode(node)}
                {node.frontmatter?.title}
              </Review>
            </ListItem>
          ))}
        </List>
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
            date(formatString: "DD MMM, YYYY")
          }
        }
      }
    }
  }
`;
