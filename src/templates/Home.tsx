/* eslint-env node, browser */

import { graphql, Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import moment from "moment";
import React from "react";

import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { WindowLocation } from "@reach/router";

import Grade from "../components/Grade";
import Layout from "../components/Layout";
import MoreList from "../components/MoreList";

const HideSmall = styled.span`
  display: none;

  @media only screen and (min-width: 700px) {
    display: inline;
  }
`;

const Home = styled.section`
  letter-spacing: 0.16px;
  margin: 0;
  padding: 0;
  text-rendering: optimizelegibility;
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
  /* display: flex; */
  /* font-family: var(--font-family-system); */
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.016875em;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3rem;
  max-width: 66rem;
  order: 6;
  text-align: center;
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
`;

interface ReviewImageProps {
  review: Review;
}

function ReviewImage({ review }: ReviewImageProps): JSX.Element | null {
  if (!review.markdown.backdrop || !review.markdown.backdrop.childImageSharp) {
    return null;
  }

  const fluid = {
    ...review.markdown.backdrop?.childImageSharp?.fluid,
  };

  return (
    <ReviewImageWrap to={`/reviews/${review.slug}/`}>
      <Img fluid={fluid} alt={`A still from ${review.movie.title}`} />
    </ReviewImageWrap>
  );
}

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

interface MoreNode {
  grade: string;
  sequence: number;
  slug: string;
  movie: {
    title: string;
    year: string;
  };
  markdown: {
    backdrop?: {
      childImageSharp?: {
        fluid: FluidObject;
      };
    };
  };
}

interface MoreReviewsProps {
  moreNodes: MoreNode[];
  pageContext: PageContext;
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
  width: calc(100% - 4rem);

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

const Placeholder = styled.span`
  display: none;
  visibility: hidden;
`;

interface PaginationProps {
  pageContext: PageContext;
}

function Pagination({ pageContext }: PaginationProps): JSX.Element {
  const { currentPage, numPages } = pageContext;
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPageUrl =
    currentPage - 1 === 1 ? "/" : `/page-${(currentPage - 1).toString()}/`;

  const nextPageUrl = `/page-${(currentPage + 1).toString()}/`;

  let newer;

  if (isFirst) {
    newer = (
      <Placeholder
        css={css`
          display: none;
          visibility: hidden;

          @media (min-width: 1000px) {
            display: block;
            margin: 0 auto 0 0 !important;
          }
        `}
      >
        ←Newer <HideSmall>Posts</HideSmall>
      </Placeholder>
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
        ←Newer <HideSmall>Posts</HideSmall>
      </Link>
    );
  }

  let older;

  if (isLast) {
    older = (
      <Placeholder
        css={css`
          display: none;
          visibility: hidden;

          @media (min-width: 1000px) {
            display: block;
            margin: 0 0 0 auto !important;
          }
        `}
      >
        Older <HideSmall>Posts</HideSmall>→
      </Placeholder>
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
        Older <HideSmall>Posts</HideSmall>→
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

  if (!isFirst) {
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
    <PaginationSection>
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
    </PaginationSection>
  );
}

const PaginationSection = styled.section`
  margin: 0 auto;
  width: calc(100% - 4rem);
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
`;

const ReadMoreWrap = styled.div`
  margin: 0 auto;
  order: 7;
  padding-top: 3rem;
`;

const ReadMoreLink = styled(Link)`
  background: #cd2653;
  border: none;
  border-radius: 0;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.0333em;
  line-height: 1.25;
  margin: 0;
  opacity: 1;
  padding: 1.1em 1.44em;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: opacity 0.15s linear;
`;

interface PageContext {
  currentPage: number;
  numPages: number;
}

interface Review {
  sequence: number;
  date: string;
  grade: string;
  slug: string;
  movie: {
    directors: {
      fullName: string;
    }[];
    runtimeMinutes: string;
    title: string;
    year: number;
  };
  markdown: {
    backdrop?: {
      childImageSharp?: {
        fluid: FluidObject;
      };
    };
  };
}

interface Props {
  location: WindowLocation;
  pageContext: PageContext;
  data: {
    page: {
      nodes: Review[];
    };
    more: {
      nodes: {
        grade: string;
        sequence: number;
        slug: string;
        movie: {
          title: string;
          year: string;
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
          {data.page.nodes.map((node) => (
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
                    Directed by{" "}
                    {node.movie.directors.map((d) => d.fullName).join(", ")}{" "}
                  </div>
                </MovieDetails>
                <ReviewImage review={node} />
                <ReadMoreWrap>
                  <ReadMoreLink to={`/reviews/${node.slug}/`}>
                    Read Review
                  </ReadMoreLink>
                </ReadMoreWrap>
                <MetaWrap>
                  Rewatched{" "}
                  <Date dateTime={node.date}>
                    {moment.utc(node.date).format("ddd MMM Do, YYYY")}
                  </Date>{" "}
                  via Alamo Drafthouse - One Loudoun.
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
