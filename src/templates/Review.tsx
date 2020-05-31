/* eslint-env node, browser */

import { graphql, Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import marked from "marked";
import moment from "moment";
import React from "react";

import { css } from "@emotion/core";
import styled from "@emotion/styled";

import calendar from "../assets/calendar.inline.svg";
import eye from "../assets/eye.inline.svg";
import Grade from "../components/Grade";
import Layout, { breakpoints } from "../components/Layout";

const Title = styled.h1`
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

const Calendar = styled(calendar)`
  display: block;
  fill: #6d6d6d;
  flex-shrink: 0;
  height: 1.8rem;
  margin-right: 1rem;
  max-width: 100%;
  width: 1.7rem;
`;

const Eye = styled(eye)`
  display: block;
  fill: #6d6d6d;
  flex-shrink: 0;
  height: 1.5rem;
  margin-right: 1rem;
  max-width: 100%;
  width: 1.5rem;
`;

const Meta = styled.aside`
  color: #6d6d6d;
  /* display: flex; */
  font-size: 1.5rem;
  letter-spacing: -0.016875em;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3rem;
  max-width: 66rem;
  order: 3;
  width: calc(100% - 4rem);

  @media (min-width: 700px) {
    font-size: 1.6rem;
    margin-top: 6rem;
  }
`;

const Main = styled.main`
  font-family: var(--font-family-serif);
  line-height: 1.4;
  margin: 0 auto;
  max-width: 66rem;
  padding-top: 1.25em;
  width: calc(100% - 4rem);

  p {
    margin-bottom: 1.25em;
  }

  @media only screen and (min-width: 700px) {
    font-size: 2.1rem;
    line-height: 1.476;
  }
`;

interface Props {
  location: {
    pathname: string;
  };
  data: {
    review: {
      title: string;
      date: string;
      grade: string;
      prettyDate: string;
      markdown: {
        backdrop?: {
          childImageSharp: {
            fluid: FluidObject;
          };
        };
        rawMarkdownBody: string;
      };
      movie: {
        imdbId: string;
        title: string;
        year: string;
        runtimeMinutes: number;
        originalTitle: string;
        directors: {
          fullName: string;
        }[];
        viewings: {
          id: string;
        }[];
      };
    };
  };
}

const AkaWrap = styled.div`
  color: var(--color-text-secondary);
  order: 3;
  padding-bottom: 1em;
  padding-top: 0.25em;
`;

const AkaTitle = styled.div`
  color: var(--color-text);
  display: inline-block;
  font-size: 18px;
  font-style: italic;
  white-space: nowrap;
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

function AkaTitles({ review }: Props["data"]): JSX.Element | null {
  if (review.movie.originalTitle === review.movie.title) {
    return null;
  }

  return (
    <AkaWrap>
      aka: <AkaTitle>{review.movie.originalTitle}</AkaTitle>
    </AkaWrap>
  );
}

const reviewContent = (
  review: Props["data"]["review"]
): JSX.Element | JSX.Element[] => {
  // const content = `${moment
  //   .utc(review.date)
  //   .format("MMM D, YYYY")
  //   .toUpperCase()}&mdash;`;

  const content = review.markdown.rawMarkdownBody.trim();

  return parse(marked(content, { pedantic: true }).toString());
};

const StyledImage = styled(Img)`
  background-repeat: no-repeat;
  background-size: cover;
  /* border: 9px solid var(--color-border); */
  display: block;
  /* margin: 0 0 10px; */
  margin: 0 auto 0;
  max-width: 1000px;
  order: 3;
  width: 100%;

  @media only screen and (min-width: 700px) {
    /* margin-top: 8rem; */
    order: 3;
  }
`;

function ReviewImage({ review }: Props["data"]): JSX.Element | null {
  if (!review?.markdown?.backdrop) {
    return null;
  }

  return (
    <StyledImage
      css={css`
        width: 100%;
      `}
      fluid={review.markdown.backdrop?.childImageSharp.fluid}
      alt={`A still from ${review.movie.title}`}
      loading="eager"
    />
  );
}

const DirectorsWrap = styled.span`
  color: var(--color-text-secondary);
  display: block;
  font-size: 12px;
  font-weight: 400;
  margin-top: 1em;
`;

const Review = styled.article`
  /* border-bottom: 1px solid var(--color-border);
  margin: 0;
  padding: 20px 0 0;

  @media only screen and (min-width: ${breakpoints.max}) {
    display: flex;
    margin-top: 16px;
    padding-top: 0;
    position: relative;
  } */
`;

const HideSmall = styled.span`
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

const Via = styled.span``;

const Date = styled.time`
  display: inline;
`;

const Header = styled.header`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 4rem 0;

  @media (min-width: 700px) {
    padding: 8rem 0;
  }
`;

const Year = styled.span`
  font-size: 3rem;
  font-weight: 300;

  @media (min-width: 700px) {
    font-size: 5.4rem;
  }
`;

const List = styled.ol`
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  line-height: 1.25;
  margin-bottom: 2rem;

  @media (min-width: 700px) {
    margin-bottom: 3rem;
  }
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

const MovieDetails = styled.div`
  align-items: center;
  color: #6d6d6d;
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  max-width: 58rem;
  order: 3;
  width: 100%;

  @media (min-width: 700px) {
    font-size: 1.6rem;
    margin-top: 3rem;
  }
`;

export default function ReviewTemplate({ data }: Props): JSX.Element {
  return (
    <Layout>
      <Header>
        <Title>
          {data.review.movie.title} <Year>{data.review.movie.year}</Year>
        </Title>
        <AkaTitles review={data.review} />
        <ReviewGrade grade={data.review.grade} />
        <MovieDetails>
          <div>
            D<Director>irected by</Director>{" "}
            {data.review.movie.directors
              .map((director) => director.fullName)
              .join(" & ")}{" "}
            &middot; {data.review.movie.runtimeMinutes}&thinsp;minutes.
          </div>
        </MovieDetails>
        <Categories>
          <CategoryLink to="/reviews/">Reviews</CategoryLink>
        </Categories>
      </Header>
      <ReviewImage review={data.review} />
      <List>
        <ListItem>
          <Review>
            <Meta>
              Watched{" "}
              <Date dateTime={data.review.date}>
                {moment.utc(data.review.date).format("ddd MMM Do, YYYY")}
              </Date>{" "}
              via Blu-ray (2018 Arrow Films).
            </Meta>
            <Main>{reviewContent(data.review)}</Main>
          </Review>
        </ListItem>
      </List>
    </Layout>
  );
}

export const pageQuery = graphql`
  query ReviewForSlug($slug: String!) {
    review(slug: { eq: $slug }) {
      slug
      date
      prettyDate: date(formatString: "MMM D, YYYY")
      grade
      movie {
        title
        year
        runtimeMinutes
        originalTitle
        directors {
          fullName
        }
        viewings {
          id
        }
      }
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
