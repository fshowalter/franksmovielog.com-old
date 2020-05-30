import { graphql } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import React from "react";
import { Remarkable } from "remarkable";

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

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  h2 {
    font-family: var(--font-family-system);
    font-feature-settings: "lnum";
    font-size: 3.2rem;
    font-variant-numeric: lining-nums;
    font-weight: 700;
    letter-spacing: -0.0415625em;
    line-height: 1.25;
    margin: 3.5rem auto 2rem;
  }

  h3 {
    font-family: var(--font-family-system);
    font-feature-settings: "lnum";
    font-size: 2.8rem;
    font-variant-numeric: lining-nums;
    font-weight: 700;
    letter-spacing: -0.0415625em;
    line-height: 1.25;
    margin: 3.5rem auto 2rem;
  }

  img {
    height: 1.8rem;
  }
`;

function pageContent(page: Props["data"]["page"]): JSX.Element | JSX.Element[] {
  const markdownParser = new Remarkable();
  return parse(markdownParser.render(page.markdown.rawMarkdownBody.trim()));
}

const PageImage = styled(Img)`
  margin: 0 -20px;

  @media only screen and (min-width: 71.24em) {
    margin: 0;
  }
`;

const Article = styled.article``;

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
          alt="Seats in a movie theater."
          loading="eager"
        />

        <Title>{data.page.title}</Title>
        <Main>{pageContent(data.page)}</Main>
      </Article>
    </Layout>
  );
}

export const query = graphql`
  query HowIGradePage {
    page(slug: { eq: "how-i-grade" }) {
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
