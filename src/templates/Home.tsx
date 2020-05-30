/* eslint-env node, browser */

import { graphql, Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import marked from "marked";
import moment from "moment";
import React from "react";
import { renderToString } from "react-dom/server";

import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { WindowLocation } from "@reach/router";

import calendar from "../assets/calendar.inline.svg";
import cinema from "../assets/cinema.inline.svg";
import collection from "../assets/collection.inline.svg";
import Grade from "../components/Grade";
import Layout, { breakpoints } from "../components/Layout";
import MoreList from "../components/MoreList";

const listBreakpoint = "650px";

const Home = styled.section`
  letter-spacing: 0.16px;
  margin: 0;
  padding: 0;
  text-rendering: optimizelegibility;

  /* @media only screen and (min-width: ${breakpoints.mid}) {
    padding: 24px 48px;
  } */
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

const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  line-height: 1.25;
  margin-bottom: 2rem;
  order: 1;

  @media (min-width: 700px) {
    margin-bottom: 3rem;
  }
`;

const ReviewHeading = styled.h2`
  font-family: var(--font-family-system);
  font-feature-settings: "lnum";
  font-size: 3.6rem;
  font-variant-numeric: lining-nums;
  font-weight: 800;
  letter-spacing: -0.0415625em;
  line-height: 1.138888889;
  margin: 0 auto;
  max-width: 100rem;
  order: 2;
  padding: 0;
  text-align: center;
  width: calc(100% - 4rem);

  @media (min-width: 700px) {
    font-size: 6.4rem;
    width: calc(100% - 8rem);
  }
`;

const Year = styled.span`
  font-size: 3rem;
  font-weight: 300;

  @media (min-width: 700px) {
    font-size: 5.4rem;
  }
`;

const ReviewHeaderLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const CategoryLink = styled(Link)`
  border-bottom: 0.15rem solid currentColor;
  color: #e90b1d;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.036666667em;
  margin: 0.5rem 0 0 1rem;
  order: 1;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.15s linear;

  @media (min-width: 700px) {
    font-size: 1.5rem;
    margin: 1rem 0 0 2rem;
  }

  &:first-of-type {
    margin-left: 0;
  }
`;

const MetaWrap = styled.div`
  color: #6d6d6d;
  display: flex;
  /* font-family: var(--font-family-system); */
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.016875em;
  margin-left: auto;
  margin-right: auto;
  max-width: 66rem;
  order: 7;
  width: calc(100% - 4rem);

  @media (min-width: 700px) {
    font-size: 1.6rem;
    margin-top: 3rem;
  }
`;

const MovieDetails = styled.div`
  align-items: center;
  color: #6d6d6d;
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2.5rem;
  max-width: 58rem;
  order: 4;
  width: calc(100% - 4rem);

  @media (min-width: 700px) {
    font-size: 1.6rem;
    margin-top: 3rem;
  }
`;

const Director = styled.span`
  display: inline-block;
  text-indent: -9999px;
  width: 0.5ch;

  &:before {
    content: ":";
    display: inline-block;
    position: absolute;
    text-indent: 9999px;
  }

  @media (min-width: 700px) {
    text-indent: 0;

    &:after {
      content: none;
    }
  }
`;

const YearAndRuntime = styled.div``;

const Main = styled.main`
  font-family: var(--font-family-serif);
  line-height: 1.4;
  margin: 0 auto;
  max-width: 66rem;
  order: 6;
  padding-top: 4rem;
  width: calc(100% - 4rem);

  /* p {
    margin: 0;

    &:nth-of-type(1) {
      text-indent: 105px;
    }
  } */

  p {
    margin-bottom: 1.25em;
  }

  @media only screen and (min-width: 700px) {
    font-size: 2.1rem;
    line-height: 1.476;
    padding-top: 8rem;
  }
`;

const ReviewImageWrap = styled(Link)`
  background-repeat: no-repeat;
  background-size: cover;
  /* border: 9px solid var(--color-border); */
  display: block;
  /* margin: 0 0 10px; */
  margin: 4rem auto 0;
  max-width: 1000px;
  order: 5;
  width: calc(100% - 4rem);

  @media only screen and (min-width: 700px) {
    margin-top: 8rem;
  }
`;

const Separator = styled.hr`
  background: linear-gradient(
    to left,
    currentColor calc(50% - 16px),
    transparent calc(50% - 16px),
    transparent calc(50% + 16px),
    currentColor calc(50% + 16px)
  );
  background-color: transparent !important;
  border: none;
  color: #6d6d6d;
  height: 0.1rem;
  margin: 4rem auto;
  max-width: 120rem;
  overflow: visible;
  position: relative;

  &:before,
  &:after {
    background: currentColor;
    content: "";
    display: block;
    height: 1.6rem;
    position: absolute;
    top: calc(50% - 0.8rem);
    transform: rotate(22.5deg);
    width: 0.1rem;
  }

  &:before {
    left: calc(50% - 0.5rem);
  }

  &:after {
    right: calc(50% - 0.5rem);
  }

  @media (min-width: 700px) {
    margin: 8rem auto;
    width: calc(100% - 8rem);
  }
`;

const Date = styled.time`
  display: inline;
  /* align-items: center;
  display: flex;
  flex-wrap: nowrap;
  font-size: inherit;
  letter-spacing: -0.016875em;
  line-height: 1.5;
  margin-right: 2rem; */
`;

const ListItem = styled.li`
  margin: 0;
  padding: 0;
  position: relative;

  /* &:after {
    background-color: var(--color-primary);
    clear: both;
    content: "";
    display: block;
    height: 1px;
    margin: calc(var(--one-line) - 1px) 0 var(--one-line);
  }

  &:last-of-type:after {
    display: none;
  } */

  &:first-of-type {
    padding: 4rem 0 0;

    @media (min-width: 700px) {
      padding: 8rem 0 0;
    }
  }

  /* &:not(:first-of-type) {
    margin-left: 0;

    @media only screen and (min-width: ${listBreakpoint}) {
      ${Review} {
        display: block;
        position: relative;
      }

      ${ReviewImageWrap} {
        float: left;
        margin-right: 24px;
        width: 33.333333%;
      }

      ${ReviewHeading} {
        float: right;
        width: calc(66.66666% - 24px);
      }

      ${Date} {
      }

      ${Main} {
        float: right;
        width: calc(66.66666% - 24px);

        &:after {
          clear: both;
          content: "";
          display: block;
        }
      }
    }
  } */
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

const Viewed = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  font-size: inherit;
  letter-spacing: -0.016875em;
  line-height: 1.5;
`;

const MoreHeading = styled.h4`
  font-family: var(--font-family-system);
  font-feature-settings: "lnum";
  font-size: 2.8rem;
  font-variant-numeric: lining-nums;
  font-weight: 700;
  letter-spacing: -0.0415625em;
  line-height: 1.25;
  margin: 0 0 2rem;

  @media (min-width: 700px) {
    font-size: 4rem;
    margin-bottom: 3rem;
  }
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
  margin: 0 auto 5rem;
  max-width: 120rem;
  width: calc(100% - 4rem);

  @media (min-width: 700px) {
    font-size: 2.4rem;
    font-weight: 700;
    margin-bottom: 8rem;
    width: calc(100% - 8rem);
  }
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
    <MoreSection>
      <MoreHeading>More Reviews</MoreHeading>
      <MoreList nodes={moreNodes} />
    </MoreSection>
  );
}

const PaginationWrap = styled.nav`
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  font-size: 1.8rem;
  font-weight: 600;
  margin: -1.5rem 0 0 -2.5rem;
  max-width: 120rem;
  width: calc(100% + 2.5rem);

  @media (min-width: 700px) {
    font-size: 2.4rem;
    font-weight: 700;
    width: calc(100% - 8rem);
  }

  @media (min-width: 1000px) {
    justify-content: space-between;
  }

  & > * {
    margin: 1.5rem 0 0 2.5rem;

    @media (min-width: 700px) {
      margin: 2.5rem 0 0 4rem;
    }

    @media (min-width: 1000px) {
      margin: 0 2rem;
    }
  }

  & a {
    color: #e90b1d;
  }
`;

const Dots = styled.span`
  color: #6d6d6d;
  transform: translateY(-0.3em);
`;

function Pagination({ pageContext }: PageContext): JSX.Element {
  const { currentPage, numPages } = pageContext;
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPageUrl =
    currentPage - 1 === 1 ? "/" : `/page-${(currentPage - 1).toString()}/`;

  const nextPageUrl = `/page-${(currentPage + 1).toString()}/`;

  let newer;

  if (isFirst) {
    newer = (
      <span
        css={css`
          display: none;
          visibility: hidden;

          @media (min-width: 1000px) {
            display: block;
            margin: 0 auto 0 0 !important;
          }
        `}
      >
        ←Newer Posts
      </span>
    );
  } else {
    newer = (
      <Link
        css={css`
          @media (min-width: 1000px) {
            display: block;
            margin: 0 auto 0 0 !important;
          }
        `}
        to={prevPageUrl}
      >
        ←Newer Posts
      </Link>
    );
  }

  let older;

  if (isLast) {
    older = (
      <span
        css={css`
          display: none;
          visibility: hidden;

          @media (min-width: 1000px) {
            display: block;
            margin: 0 0 0 auto !important;
          }
        `}
      />
    );
  } else {
    older = (
      <Link
        css={css`
          @media (min-width: 1000px) {
            display: block;
            margin: 0 0 0 auto !important;
          }
        `}
        to={nextPageUrl}
      >
        Older Posts→
      </Link>
    );
  }

  let firstPage;

  if (currentPage - 1 > 1) {
    firstPage = <Link to="/">1</Link>;
  }

  let newerDots = null;

  if (currentPage - 2 > 1) {
    newerDots = <Dots>…</Dots>;
  }

  let prevPage;

  if (isFirst) {
    prevPage = <span />;
  } else {
    prevPage = <Link to={prevPageUrl}>{currentPage - 1}</Link>;
  }

  let nextPage;

  if (isLast) {
    nextPage = <span />;
  } else {
    nextPage = <Link to={nextPageUrl}>{currentPage + 1}</Link>;
  }

  let olderDots = null;

  if (currentPage + 2 < numPages) {
    olderDots = <Dots>…</Dots>;
  }

  let lastPage = null;

  if (currentPage + 1 < numPages) {
    lastPage = <Link to={`/page-${numPages}/`}>{numPages}</Link>;
  }

  return (
    <PaginationWrap>
      {newer}
      {firstPage}
      {newerDots}
      {prevPage}
      <span aria-current="page">{currentPage}</span>
      {nextPage}
      {olderDots}
      {lastPage}
      {older}
    </PaginationWrap>
  );
}

const Via = styled.span`
  display: block;
  height: 0;
  visibility: hidden;
  width: 0;

  @media (min-width: 700px) {
    display: inline;
    height: auto;
    visibility: visible;
    width: auto;
  }
`;

const ReviewGrade = styled(Grade)`
  display: block;
  height: 3rem;
  margin: 1.5rem 0 0;
  order: 3;

  @media (min-width: 700px) {
    height: 4.5rem;
    margin-top: 2rem;
  }
  /* left: 1px; */
  /* position: absolute; */
  /* top: 5px; */
  /* width: 95px; */
`;

// const reviewContent = (
//   review: Props["data"]["page"]["nodes"][0]
// ): JSX.Element | JSX.Element[] => {
//   const content = `${renderToString(
//     <InlineGrade grade={review.grade} width={95} height={95} />
//   )} ${marked(review.markdown.firstParagraph.trim())}`;

//   return parse(content.toString());
// };

const reviewContent = (
  review: Props["data"]["page"]["nodes"][0]
): JSX.Element | JSX.Element[] => {
  const content = marked(review.markdown.rawMarkdownBody.trim());

  return parse(content.toString());
};

const Calendar = styled(calendar)`
  display: block;
  fill: #6d6d6d;
  flex-shrink: 0;
  height: 1.8rem;
  margin-right: 1rem;
  max-width: 100%;
  width: 1.7rem;
`;

const Cinema = styled(cinema)`
  display: block;
  fill: #6d6d6d;
  flex-shrink: 0;
  height: 1.8rem;
  margin-right: 1rem;
  max-width: 100%;
  width: 1.7rem;
`;

const Collection = styled(collection)`
  display: block;
  fill: #6d6d6d;
  flex-shrink: 0;
  height: 1.8rem;
  margin-right: 1rem;
  max-width: 100%;
  width: 1.7rem;
`;

interface PageContext {
  currentPage: number;
  numPages: number;
}

interface Props {
  location: WindowLocation;
  pageContext: PageContext;
  data: {
    page: {
      nodes: {
        sequence: number;
        date: string;
        grade: string;
        slug: string;
        movie: {
          directors: string[];
          runtimeMinutes: string;
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
                    {node.movie.title} <Year>{node.movie.year}</Year>
                  </ReviewHeaderLink>
                </ReviewHeading>
                <ReviewGrade grade={node.grade} />
                <MovieDetails>
                  <div>
                    D<Director>irected by</Director>{" "}
                    {node.movie.directors.map((d) => d.fullName).join(", ")}{" "}
                    &middot; {node.movie.runtimeMinutes} minutes
                  </div>
                </MovieDetails>
                {imageForNode(node, index)}
                <Main>{reviewContent(node)}</Main>
                <MetaWrap>
                  <Calendar />
                  <span>
                    Watched{" "}
                    <Date dateTime={node.date}>
                      {moment.utc(node.date).format("ddd MMM Do, YYYY")}
                    </Date>{" "}
                    <Via>via </Via>Alamo Drafthouse - One Loudoun<Via>.</Via>
                  </span>
                </MetaWrap>
                <Categories>
                  <CategoryLink to="/reviews/">Reviews</CategoryLink>
                </Categories>
              </Review>
              <Separator />
            </ListItem>
          ))}
        </List>
        <MoreReviews moreNodes={data.more.nodes} pageContext={pageContext} />
        <Pagination pageContext={pageContext} />
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
          year
        }
      }
    }
  }
`;
