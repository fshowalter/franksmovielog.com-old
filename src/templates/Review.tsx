import { graphql } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import React from "react";

import styled from "@emotion/styled";

import Layout from "../components/Layout";
import SingleColumn from "../components/SingleColumn";

const Title = styled.h1`
  font-size: 32px;
  line-height: 1.1;
  margin-bottom: 0;
  padding: 30px 20px 20px;
  text-align: center;

  @media only screen and (min-width: 35em) {
    font-size: 42px;
  }
`;

const Article = styled.article`
  padding-bottom: 30px;
`;

const Content = styled.div`
  margin: 0 auto;
  max-width: 740px;
  padding: 0 20px;

  blockquote {
    font-style: italic;
  }

  p {
    font-feature-settings: "ordn", "lnum";
    font-size: 18px;
    letter-spacing: -0.05px;
    line-height: 27px;
    margin: 0 auto 30px;
    max-width: 700px;

    @media (min-width: 48em) {
      font-size: 21px;
      line-height: 1.58;
      margin-bottom: 21px;
    }
  }

  @media (min-width: 48em) {
    max-width: 80%;
  }
`;

interface Props {
  data: {
    review: {
      fields: {
        backdrop?: {
          childImageSharp: {
            fluid: FluidObject;
          };
        };
      };
      frontmatter: {
        title: string;
      };
      html: string;
    };
  };
}

const ReviewTemplate = ({ data }: Props) => {
  return (
    <Layout>
      <SingleColumn>
        <Article>
          <Img
            fluid={data.review.fields.backdrop?.childImageSharp.fluid}
            alt={`A still from ${data.review.frontmatter.title}`}
          />
          <Title>{data.review.frontmatter.title}</Title>
          <Content>{parse(data.review.html)}</Content>
        </Article>
      </SingleColumn>
    </Layout>
  );
};

export default ReviewTemplate;

export const pageQuery = graphql`
  query ReviewForSlug($slug: String!) {
    review: markdownRemark(frontmatter: { slug: { eq: $slug } }) {
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
      html
      frontmatter {
        title
        slug
      }
    }
  }
`;
