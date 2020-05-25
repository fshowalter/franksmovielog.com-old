/* eslint-env node, browser */

import { graphql, Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import marked from "marked";
import moment from "moment";
import React from "react";
import { renderToString } from "react-dom/server";

import styled from "@emotion/styled";
import { WindowLocation } from "@reach/router";

import Grade from "../components/Grade";
import Layout, { breakpoints } from "../components/Layout";
import MoreList from "../components/MoreList";

const listBreakpoint = "650px";

const Home = styled.section`
  letter-spacing: 0.16px;
  margin: 0;
  padding: 28px 0;
  text-rendering: optimizelegibility;

  @media only screen and (min-width: ${breakpoints.mid}) {
    padding: 0;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    padding: 0;
  }
`;

const List = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const Review = styled.article`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ReviewHeading = styled.h2`
  color: rgba(0, 0, 0, 0.75);
  font-size: 26px;
  font-weight: 900;
  order: 2;
  padding: 0;

  @media only screen and (min-width: ${listBreakpoint}) {
    font-size: 24px;
  }
`;

const ReviewHeaderLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const Main = styled.main`
  color: rgba(0, 0, 0, 0.54);
  font-family: var(--font-family-serif);
  font-size: 18px;
  font-weight: 300;
  line-height: 28px;
  order: 4;
  position: relative;

  p {
    margin: 0;

    &:nth-of-type(1) {
      text-indent: 105px;
    }
  }

  @media only screen and (min-width: ${listBreakpoint}) {
    /* margin-bottom: 2px; */
    order: 3;
  }
`;

const ReviewImageWrap = styled(Link)`
  background-repeat: no-repeat;
  background-size: cover;
  display: block;
  margin: 0;
  min-width: 33%;
  order: 3;

  @media only screen and (min-width: ${listBreakpoint}) {
    margin: 0;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    order: 1;
  }
`;

const Date = styled.time`
  color: var(--color-text-secondary);
  display: block;
  font-size: 12px;
  font-weight: 400;
  line-height: calc(0.5 * var(--one-line));
  order: 1;
  text-transform: uppercase;

  @media only screen and (min-width: ${listBreakpoint}) {
    font-size: 13px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    font-weight: 300;
    order: 4;
  }
`;

const ListItem = styled.li`
  margin: 0;
  padding: 0;
  position: relative;

  &:after {
    background-color: var(--color-primary);
    clear: both;
    content: "";
    display: block;
    height: 1px;
    margin: calc(var(--one-line) - 1px) 0 var(--one-line);
  }

  &:last-of-type:after {
    display: none;
  }

  &:not(:first-of-type) {
    margin-left: 0;

    @media only screen and (min-width: ${listBreakpoint}) {
      ${Review} {
        display: block;
        position: relative;
      }

      /* ${ReviewImageWrap} {
        float: right;
        margin-left: 30px;
        width: 33.333333%;
      } */

      /* ${ReviewHeading} {
        float: left;
        max-width: calc(66.66666% - 30px);
      } */

      ${Date} {
        font-weight: 300;
        margin-bottom: 12px;

        &:after {
          clear: both;
          content: "";
          display: block;
        }
      }

      ${Main} {
        clear: left;
      }
    }
  }
`;

type ReviewNode = Props["data"]["page"]["nodes"][0];

const imageForNode = (node: ReviewNode, index: number): JSX.Element | null => {
  if (!node.markdown.backdrop || !node.markdown.backdrop.childImageSharp) {
    return null;
  }

  const fluid = {
    ...node.markdown.backdrop?.childImageSharp?.fluid,
  };

  if (index === 0) {
    fluid.sizes = `(max-width: ${breakpoints.mid}) calc(100vw - 48px), 1800px`;
  }

  return (
    <ReviewImageWrap to={`/reviews/${node.slug}/`}>
      <Img fluid={fluid} alt={`A still from ${node.movie.title}`} />
    </ReviewImageWrap>
  );
};

const MoreHeading = styled.h4`
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 400;
  margin: 0 0 10px;
  padding-bottom: 4px;
  text-rendering: optimizeLegibility;
  text-transform: uppercase;
  word-wrap: break-word;
`;

const NextPageLink = styled(Link)`
  border: 1px solid var(--color-border);
  border-radius: 5px;
  color: var(--color-text-heading);
  display: block;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 1px;
  line-height: 38px;
  margin: 30px auto 60px;
  padding: 0 40px 0 20px;
  position: relative;
  text-align: center;
  text-decoration: none;
  width: 175px;

  &:after {
    background-image: url('data:Image/svg+xml;charset=utf8,<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M6.165 3.874c-.217-.204-.22-.53-.008-.73.206-.192.56-.195.776.008l5.902 5.48c.11.102.165.236.165.37-.002.126-.055.262-.165.365l-5.902 5.478c-.217.204-.564.207-.776.007-.206-.193-.21-.525.008-.728L11.69 9 6.165 3.873z"></path></svg>');
    background-size: contain;
    content: "";
    height: 20px;
    opacity: 0.3;
    position: absolute;
    right: 20px;
    top: 9px;
    width: 20px;
  }
`;

interface MoreReviewsProps {
  moreNodes: Props["data"]["more"]["nodes"];
  pageContext: Props["pageContext"];
}

const MoreSection = styled.section`
  padding-top: 60px;
`;

function MoreReviews({
  moreNodes,
  pageContext,
}: MoreReviewsProps): JSX.Element | null {
  const { currentPage, numPages } = pageContext;
  const isLast = currentPage === numPages;
  const nextPage = (currentPage + 1).toString();

  if (isLast) {
    return null;
  }

  return (
    <>
      <MoreSection>
        <MoreHeading>More Reviews</MoreHeading>
        <MoreList nodes={moreNodes} />
      </MoreSection>
      <NextPageLink to={`/page-${nextPage}/`} rel="next">
        Next page
      </NextPageLink>
    </>
  );
}

const InlineGrade = styled(Grade)`
  display: block;
  height: auto;
  left: 1px;
  position: absolute;
  top: 5px;
  width: 95px;
`;

const reviewContent = (
  review: Props["data"]["page"]["nodes"][0]
): JSX.Element | JSX.Element[] => {
  const content = `${renderToString(
    <InlineGrade grade={review.grade} width={95} height={95} />
  )} ${marked(review.markdown.firstParagraph.trim())}`;

  return parse(content.toString());
};

interface Props {
  location: WindowLocation;
  pageContext: {
    currentPage: number;
    numPages: number;
  };
  data: {
    page: {
      nodes: {
        sequence: number;
        date: string;
        grade: string;
        slug: string;
        movie: {
          title: string;
          year: number;
        };
        markdown: {
          rawMarkdownBody: string;
          backdrop?: {
            childImageSharp?: {
              fluid: FluidObject;
            };
          };
          firstParagraph: string;
        };
      }[];
    };
    more: {
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
    };
  };
}

export default function HomeTemplate({
  pageContext,
  data,
}: Props): JSX.Element {
  return (
    <Layout>
      <Home>
        <List start={data.page.nodes[0].sequence} reversed>
          {data.page.nodes.map((node, index) => (
            <ListItem key={node.sequence}>
              <Review>
                <ReviewHeading>
                  <ReviewHeaderLink to={`/reviews/${node.slug}/`}>
                    {node.movie.title}
                  </ReviewHeaderLink>
                </ReviewHeading>
                {imageForNode(node, index)}
                <Main>{reviewContent(node)}</Main>
                <Date dateTime={node.date}>
                  {moment.utc(node.date, "DD MMM YYYY").format("DD MMM YYYY")}
                </Date>
              </Review>
            </ListItem>
          ))}
        </List>
        <MoreReviews moreNodes={data.more.nodes} pageContext={pageContext} />
      </Home>
    </Layout>
  );
}

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!, $moreSkip: Int!, $moreLimit: Int!) {
    page: allReview(
      sort: { fields: [sequence], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        date(formatString: "DD MMM YYYY")
        grade
        slug
        sequence
        movie {
          title
          runtimeMinutes
          originalTitle
          year
          directors {
            fullName
          }
        }
        markdown {
          firstParagraph
          rawMarkdownBody
          backdrop {
            childImageSharp {
              fluid(toFormat: JPG, jpegQuality: 75, maxWidth: 1800) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
    more: allReview(
      sort: { fields: [sequence], order: DESC }
      limit: $moreLimit
      skip: $moreSkip
    ) {
      nodes {
        grade
        slug
        sequence
        markdown {
          backdrop {
            childImageSharp {
              fluid(toFormat: JPG, jpegQuality: 75, maxWidth: 684) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        movie {
          title
        }
      }
    }
  }
`;
