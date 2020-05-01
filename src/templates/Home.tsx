import { graphql, Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import moment from "moment";
import React from "react";
import { renderToString } from "react-dom/server";
import remark from "remark";
import remarkHTML from "remark-html";

import { css, Global } from "@emotion/core";
import styled from "@emotion/styled";
import { WindowLocation } from "@reach/router";

import logo from "../assets/logo-new.inline.svg";
import Grade from "../components/Grade";
import Layout from "../components/Layout";
import MoreList from "../components/MoreList";

const HomeWrap = styled.div`
  /* display: flex;
  align-items: flex-start;
  flex-wrap: wrap; */
  margin: 0;
  font-family: "Charter", "Iowan Old Style", Georgia, Cambria, "Times New Roman",
    Times, serif;
  letter-spacing: 0.16px;
  text-rendering: optimizelegibility;
  background: #fff;
  padding: 20px;

  @media only screen and (min-width: 48em) {
    padding: 20px 0;
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
  margin-top: 30px;
`;

const ReviewHeading = styled.h3`
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
  margin-top: 0;
  margin-bottom: 8px;
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
  /* border: 9px solid #eee; */
  display: block;
  /* margin: 0 0 10px; */
  /* position: absolute; */
  /* float: left; */
  min-width: 200px;
  /* margin-left: -200px; */
  /* margin-right: 20px; */
  /* left: -220px; */
  /* top: -14px; */
  margin: 0;

  @media only screen and (min-width: 56.25em) {
    /* margin-bottom: 15px; */
  }

  @media only screen and (min-width: 71.25em) {
    border: none;
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

const CWrap = styled.div`
  /* border-top: solid 1px #eee; */
  /* padding-left: 30px; */
  /* flex: 1; */
  /* display: flex; */
  padding: 0;
`;

const Aside = styled.aside`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 13px;
  width: 200px;
  color: rgba(0, 0, 0, 0.54);
  line-height: 2.5;
  text-transform: uppercase;
  order: 3;
  /* position: absolute;
  left: -205px;
  text-align: right;
  top: 9px;

  &:after {
    content: "\u2014";
    color: #eee;
  } */
`;

const ListItem = styled.li`
  margin: 0;
  padding: 0;
  /* border-left: solid 1px #eee; */
  position: relative;
  /* border-bottom: solid 1px #eee; */

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
  /*
  &:before {
    background: #fdfdfd;
    border: #e9e7e0 1px solid;
    border-radius: 100%;
    content: "";
    display: block;
    height: 7px;
    left: -5px;
    position: absolute;
    top: 12px;
    width: 7px;
    z-index: 500;
  } */

  /* margin-left: -200px; */

  &:last-of-type:after {
    display: none;
  }

  &:not(:first-of-type) {
    /* padding-top: 25px; */
    margin-left: 0;

    @media only screen and (min-width: 40.625em) {
      ${Review} {
        flex-direction: row;
        justify-content: space-between;
      }

      ${Aside} {
      }

      ${ReviewHeader} {
      }

      ${ReviewImageWrap} {
        order: 2;
        margin: 0 0 16px;
      }

      ${ReviewExcerpt} {
      }

      ${CWrap} {
        order: 1;
        padding-right: 24px;
      }

      ${ReviewImageWrap} {
        margin-top: 30px;
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

const StyledGrade = styled(Grade)`
  display: inline-block;
  height: auto;
  margin-right: 2px;
  position: relative;
  top: 3px;
  width: 95px;
`;

const buildExcerpt = (node: ReviewNode): JSX.Element | JSX.Element[] => {
  const excerpt = `${renderToString(
    <StyledGrade grade={node.grade} width={95} height={95} />
  )} ${node.markdown.firstParagraph}`;

  return parse(remark().use(remarkHTML).processSync(excerpt).toString());
};

const PaginationHeading = styled.div`
  border-bottom: 1px solid #eee;
  font-size: 16px;
  margin: 60px 0 10px;
  padding-bottom: 4px;
  text-rendering: optimizeLegibility;
  word-wrap: break-word;
  color: rgba(0, 0, 0, 0.54);
`;

const PaginationItemsWrap = styled.div`
  margin-bottom: 40px;
`;

const PaginationLinkWrap = styled.div`
  margin-top: 20px;
  text-align: center;
  font-family: "Charter", "Georgia", "Times New Roman", Times, serif;
`;

const PaginationNextPageLink = styled(Link)`
  border: 1px solid #eee;
  border-radius: 5px;
  display: inline-block;
  font-size: 15px;
  line-height: 38px;
  margin-top: 30px;
  padding: 0 60px 0 20px;
  position: relative;
  text-align: center;
  text-decoration: none;
  color: inherit;

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
  padding: 0;
  margin: 0 auto 40px;

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

const Logo = styled(logo)`
  width: 60px;
  height: 60px;
  /* margin-bottom: 40px; */
  background-color: #579;
  fill: #579;
  /* margin-left: 140px; */
  flex-shrink: 0;
`;

const HeaderWrap = styled.div``;

const Header = styled.header`
  max-width: 150px;
  /* margin-left: 25px; */

  /* padding: 0 25px; */
  display: flex;
  max-width: 900px;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  /* background-color: #222; */

  @media only screen and (min-width: 68.75em) {
    border-left: solid 1px #eee;
  }
`;

const Menu = styled.img`
  width: 28px;
  height: 28px;
`;

const NavLink = styled(Link)`
  display: block;
  /* color: #c9c4b3; */
  color: inherit;
  /* font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.1em; */
  text-decoration: none;
  /* border-bottom: 1px solid #eee; */
  padding: 10px 0;
  clear: both;
`;

const TextInputWrap = styled.div`
  border-bottom: solid 1px var(--color-primary);
  /* margin-bottom: 8px; */
  /* padding-bottom: 7px; */
  /* margin-top: 20px; */
  /* margin-right: 20px; */
  max-width: 180px;
`;

const TextInput = styled.input`
  backface-visibility: hidden;
  background-color: #eee;
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  color: #222;
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 16px;
  padding: 10px;
  width: 100%;
  ::placeholder {
    color: var(--color-text-hint);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    font-size: 14px;
    font-weight: normal;
  }
`;

const Main = styled.main`
  max-width: 66ch;
  order: 3;
  font-size: 18px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 400;
  color: rgba(0, 0, 0, 0.54);

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
  )} ${review.markdown.firstParagraph.trim()}`;

  return parse(remark().use(remarkHTML).processSync(content).toString());
};

const MenuWrap = styled.div`
  display: flex;
  justify-content: space-between;
  width: 700px;
  margin: 0 30px;
  font-size: 16px;
  font-weight: 300;
  /* text-transform: uppercase; */
  letter-spacing: 1px;
  font-family: "Charter", "Iowan Old Style", Georgia, Cambria, "Times New Roman",
    Times, serif;
`;

export default function HomeTemplate({ location, pageContext, data }: Props) {
  return (
    <Layout location={location}>
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
                  <Aside>{moment.utc(node.date).format("DD MMM YYYY")}</Aside>
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
