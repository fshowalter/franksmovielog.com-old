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
import Layout from "../components/Layout";
import MoreList from "../components/MoreList";

const HomeWrap = styled.div`
  background: #fff;
  font-family: "Charter", "Iowan Old Style", Georgia, Cambria, "Times New Roman",
    Times, serif;
  letter-spacing: 0.16px;
  margin: 0;
  padding: 20px;
  text-rendering: optimizelegibility;

  @media only screen and (min-width: 48em) {
    padding: 0;
  }
`;

const List = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
  /* padding-right: 25px; */
`;

const Review = styled.article`
  display: flex;
  flex-direction: column;
`;

const ReviewHeader = styled.header`
  margin-top: 30px;
`;

const ReviewHeading = styled.h3`
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 8px;
  margin-top: 0;
  padding: 0 0 0;
  /* text-align: center; */

  @media only screen and (min-width: 35em) {
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

  @media only screen and (min-width: 71.25em) {
    border: none;
  }
`;

const CWrap = styled.div`
  /* border-top: solid 1px #eee; */
  /* padding-left: 30px; */
  /* flex: 1; */
  /* display: flex; */
  padding: 0;
`;

const Aside = styled.aside`
  color: rgba(0, 0, 0, 0.54);
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

    @media only screen and (min-width: 40.625em) {
      margin: 40px 0 0;
    }
  }

  &:last-of-type:after {
    display: none;
  }

  &:not(:first-of-type) {
    margin-left: 0;

    @media only screen and (min-width: 40.625em) {
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
      />
    </ReviewImageWrap>
  );
};

const PaginationHeading = styled.div`
  border-bottom: 1px solid #eee;
  color: rgba(0, 0, 0, 0.54);
  font-size: 16px;
  margin: 60px 0 10px;
  padding-bottom: 4px;
  text-rendering: optimizeLegibility;
  word-wrap: break-word;
`;

const PaginationItemsWrap = styled.div`
  margin-bottom: 40px;
`;

const PaginationLinkWrap = styled.div`
  font-family: "Charter", "Georgia", "Times New Roman", Times, serif;
  margin-top: 20px;
  text-align: center;
`;

const PaginationNextPageLink = styled(Link)`
  border: 1px solid #eee;
  border-radius: 5px;
  color: inherit;
  display: inline-block;
  font-size: 15px;
  line-height: 38px;
  margin-top: 30px;
  padding: 0 60px 0 20px;
  position: relative;
  text-align: center;
  text-decoration: none;

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

interface PaginationProps {
  moreNodes: Props["data"]["more"]["nodes"];
  pageContext: Props["pageContext"];
}

const PaginationWrap = styled.div`
  margin: 0 auto 40px;
  padding: 0;

  @media only screen and (min-width: 48em) {
    padding: 0;
  }
`;

const MoreReviewsList = styled(MoreList)`
  font-family: "Charter", "Georgia", "Times New Roman", Times, serif;
`;

const MoreReviews: React.FC<PaginationProps> = ({
  moreNodes,
  pageContext,
}: PaginationProps) => {
  const { currentPage, numPages } = pageContext;
  const isLast = currentPage === numPages;
  const nextPage = (currentPage + 1).toString();

  if (isLast) {
    return null;
  }

  return (
    <PaginationWrap>
      <PaginationHeading>More Posts</PaginationHeading>
      <MoreReviewsList nodes={moreNodes} />
      <PaginationItemsWrap>
        <PaginationLinkWrap>
          <PaginationNextPageLink to={`/page-${nextPage}/`} rel="next">
            More reviews
          </PaginationNextPageLink>
        </PaginationLinkWrap>
      </PaginationItemsWrap>
    </PaginationWrap>
  );
};

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
  top: 3px;
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
      <HomeWrap>
        <List>
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
                  <Aside>
                    {moment.utc(node.date, "DD MMM YYYY").format("DD MMM YYYY")}
                  </Aside>
                </CWrap>
              </Review>
            </ListItem>
          ))}
        </List>
        <MoreReviews moreNodes={data.more.nodes} pageContext={pageContext} />
      </HomeWrap>
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
