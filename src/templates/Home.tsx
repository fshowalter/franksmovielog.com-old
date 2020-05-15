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
  padding: 24px;
  text-rendering: optimizelegibility;

  @media only screen and (min-width: ${breakpoints.mid}) {
    padding: 0 30px;
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
`;

const ReviewHeader = styled.header`
  margin-top: 20px;
`;

const ReviewHeading = styled.h2`
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 8px;
  margin-top: 0;
  padding: 0 0 0;

  @media only screen and (min-width: ${listBreakpoint}) {
    font-size: 24px;
  }
`;

const ReviewHeaderLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const ReviewImageWrap = styled(Link)`
  background-repeat: no-repeat;
  background-size: cover;
  display: block;
  margin: 0;
  min-width: 200px;
`;

const CWrap = styled.div`
  /* border-top: solid 1px #eee; */
  /* padding-left: 30px; */
  /* flex: 1; */
  /* display: flex; */
  padding: 0;
`;

const Date = styled.time`
  color: var(--color-secondary);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 13px;
  line-height: 2.5;
  order: 3;
  text-transform: uppercase;
  width: 200px;
`;

const ListItem = styled.li`
  margin: 0;
  padding: 0;
  position: relative;

  &:after {
    background-color: #eee;
    clear: both;
    content: "";
    display: block;
    height: 1px;
    margin: 40px 20px 0;

    @media only screen and (min-width: ${listBreakpoint}) {
      margin: 40px 0 0;
    }
  }

  &:last-of-type:after {
    display: none;
  }

  &:not(:first-of-type) {
    margin-left: 0;

    @media only screen and (min-width: ${listBreakpoint}) {
      ${Review} {
        flex-direction: row;
        justify-content: space-between;
      }

      ${ReviewImageWrap} {
        margin: 30px 0 16px;
        order: 2;
      }

      ${CWrap} {
        order: 1;
        padding-right: 24px;
      }
    }
  }
`;

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

type ReviewNode = Props["data"]["page"]["nodes"][0];

const imageForNode = (node: ReviewNode): React.ReactElement | null => {
  if (!node.markdown.backdrop || !node.markdown.backdrop.childImageSharp) {
    return null;
  }

  return (
    <ReviewImageWrap to={`/reviews/${node.slug}/`}>
      <Img
        fluid={node.markdown.backdrop?.childImageSharp?.fluid}
        alt={`A still from ${node.movie.title}`}
        loading="eager"
      />
    </ReviewImageWrap>
  );
};

const MoreHeading = styled.h4`
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 16px;
  font-style: normal;
  margin: 60px 0 10px;
  padding-bottom: 4px;
  text-rendering: optimizeLegibility;
  word-wrap: break-word;
`;

const NextPageLink = styled(Link)`
  border: 1px solid #eee;
  border-radius: 5px;
  color: inherit;
  display: block;
  font-size: 15px;
  line-height: 38px;
  margin: 30px auto 60px;
  padding: 0 60px 0 20px;
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

const MoreSection = styled.section``;

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

const Main = styled.main`
  color: rgba(0, 0, 0, 0.54);
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;
  max-width: 66ch;
  order: 3;

  p {
    margin: 0;
  }
`;

const InlineGrade = styled(Grade)`
  display: inline-block;
  height: auto;
  margin-right: 2px;
  position: relative;
  top: 0px;
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

export default function HomeTemplate({
  pageContext,
  data,
}: Props): JSX.Element {
  return (
    <Layout>
      <Home>
        <List start={data.page.nodes[0].sequence} reversed>
          {data.page.nodes.map((node) => (
            <ListItem key={node.sequence}>
              <Review>
                {imageForNode(node)}
                <CWrap>
                  <ReviewHeader>
                    <ReviewHeading>
                      <ReviewHeaderLink to={`/reviews/${node.slug}/`}>
                        {node.movie.title}
                      </ReviewHeaderLink>
                    </ReviewHeading>
                  </ReviewHeader>
                  <Main>{reviewContent(node)}</Main>
                  <Date dateTime={node.date}>
                    {moment.utc(node.date, "DD MMM YYYY").format("DD MMM YYYY")}
                  </Date>
                </CWrap>
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
              fluid(toFormat: JPG, jpegQuality: 75) {
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
              fluid(toFormat: JPG, jpegQuality: 75) {
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
