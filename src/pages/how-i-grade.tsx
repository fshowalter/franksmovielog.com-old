import { graphql } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import React from "react";
import { Remarkable } from "remarkable";

import styled from "@emotion/styled";

import Layout from "../components/Layout";

const Title = styled.h1`
  font-size: 32px;
  line-height: 1.1;
  margin-bottom: 0;
  padding: 30px 0 0;

  @media only screen and (min-width: 35em) {
    font-size: 42px;
  }
`;

const Wrap = styled.div`
  max-width: 900px;
  padding: 0 20px 30px;

  @media only screen and (min-width: 71.24em) {
    padding: 0 0 30px;
  }
`;

const Main = styled.main`
  color: rgba(0, 0, 0, 0.87);
  font-size: 20px;
  line-height: 1.5;
  max-width: 66ch;
  order: 3;
  padding-top: 20px;

  @media only screen and (min-width: 71.25em) {
    border-top: none;
    margin-top: 0;
    order: 2;
    padding-left: 30px;
    padding-top: 40px;
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

const Article = styled.article`
  border-top: 1px solid #eee;
  margin-top: 30px;
  padding-top: 20px;

  @media only screen and (min-width: 71.25em) {
    display: flex;
    margin-top: 16px;
    padding-top: 0;
    position: relative;
  }
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
      <Wrap>
        <PageImage
          fluid={data.page.markdown.backdrop?.childImageSharp.fluid}
          alt="Seats in a movie theater."
          loading="eager"
        />

        <Title>{data.page.title}</Title>
        <Article>
          <Main>{pageContent(data.page)}</Main>
        </Article>
      </Wrap>
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
