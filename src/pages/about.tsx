import { graphql } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import marked from "marked";
import moment from "moment";
import React from "react";

import styled from "@emotion/styled";

import Layout from "../components/Layout";

const Title = styled.h1`
  font-family: var(--font-family-system);
  font-size: 3.6rem;
  font-weight: 800;
  line-height: 1.138888889;
  margin: 0 auto;
  padding: 4rem 0;
  text-align: center;
  width: calc(100% - 4rem);
`;

const Main = styled.main`
  font-family: var(--font-family-serif);
  line-height: 1.4;
  margin: 0 auto;
  max-width: 66rem;
  width: calc(100% - 4rem);

  p {
    margin-bottom: 1.25em;
  }

  @media only screen and (min-width: 700px) {
    font-size: 2.1rem;
    line-height: 1.476;
  }
`;

function pageContent(page: Props["data"]["page"]): JSX.Element | JSX.Element[] {
  const content = `${moment
    .utc(page.date)
    .format("MMM D, YYYY")
    .toUpperCase()}&mdash;${page.markdown.rawMarkdownBody.trim()}`;

  return parse(marked(content, { pedantic: true }).toString());
}

const PageImage = styled(Img)`
  margin: 0 -20px;

  @media only screen and (min-width: 71.24em) {
    margin: 0;
  }
`;

const Article = styled.article`
  /* border-top: 1px solid #eee;
  margin-top: 30px;
  padding-top: 20px;

  @media only screen and (min-width: 71.25em) {
    display: flex;
    margin-top: 16px;
    padding-top: 0;
    position: relative;
  } */
`;

interface Props {
  location: {
    pathname: string;
  };
  data: {
    page: {
      title: string;
      date: string;
      markdown: {
        backdrop?: {
          childImageSharp: {
            fluid: FluidObject;
          };
        };
        rawMarkdownBody: string;
      };
    };
  };
}

export default function AboutPage({ data }: Props): JSX.Element {
  return (
    <Layout>
      <Article>
        <PageImage
          fluid={data.page.markdown.backdrop?.childImageSharp.fluid}
          alt="A still from Casablanca (1942)"
          loading="eager"
        />
        <Title>{data.page.title}</Title>
        <Main>{pageContent(data.page)}</Main>
      </Article>
    </Layout>
  );
}

export const query = graphql`
  query AboutPage {
    page(slug: { eq: "about" }) {
      slug
      date
      title
      markdown {
        rawMarkdownBody
        backdrop {
          childImageSharp {
            fluid(toFormat: JPG, jpegQuality: 75) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
