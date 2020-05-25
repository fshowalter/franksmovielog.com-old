/* eslint-env node, browser */

import { graphql } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import marked from "marked";
import moment from "moment";
import React from "react";

import styled from "@emotion/styled";

import Grade from "../components/Grade";
import Layout, { breakpoints } from "../components/Layout";

const Title = styled.h1`
  font-size: 32px;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 0;
  padding: 30px 0 0;

  @media only screen and (min-width: ${breakpoints.mid}) {
    font-size: 42px;
  }
`;

const ReviewSection = styled.section`
  max-width: 900px;

  @media only screen and (min-width: ${breakpoints.max}) {
    padding: 0 0 30px;
  }
`;

const Meta = styled.aside`
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 300;
  line-height: 1.4;
  min-width: 170px;
  order: 2;

  @media only screen and (min-width: ${breakpoints.max}) {
    border-right: solid 1px var(--color-border);
    font-family: inherit;
    font-size: 16px;
    font-weight: 500;
    order: 1;
    padding-right: 20px;
    padding-top: 44px;
    position: relative;
    width: 220px;

    &:before {
      background: var(--color-border);
      content: "";
      height: 1px;
      position: absolute;
      right: 0px;
      top: 54px;
      width: 20px;
      z-index: -1;
    }

    &:after {
      background: #fdfdfd;
      border: var(--color-border) 1px solid;
      border-radius: 100%;
      content: "";
      display: block;
      height: 7px;
      position: absolute;
      right: -5px;
      top: 50px;
      width: 7px;
      z-index: 500;
    }
  }
`;

const Main = styled.main`
  color: var(--color-text);
  font-family: var(--font-family-serif);
  font-size: 20px;
  line-height: 1.5;
  max-width: 66ch;
  order: 3;
  padding: 20px 0 0;

  p {
    margin-bottom: 30px;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    margin-top: 0;
    order: 2;
    padding-left: 30px;
    padding-top: 40px;
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

const YearAndRuntimeWrap = styled.span`
  color: var(--color-text-secondary);
  display: block;
  font-size: 14px;
  font-weight: 300;
`;

const AkaWrap = styled.div`
  color: var(--color-text-secondary);
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

const YearAndRuntimeDivider = styled.span`
  color: var(--color-border);
`;

const ReviewGrade = styled(Grade)`
  display: block;
  height: auto;
  line-height: 49px;
  margin-bottom: 5px;
  position: relative;
  width: 110px;

  @media only screen and (min-width: ${breakpoints.max}) {
    position: absolute;
    top: 10px;
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

function ReviewImage({ review }: Props["data"]): JSX.Element | null {
  const isSSR = typeof window === "undefined";

  if (!review?.markdown?.backdrop) {
    return null;
  }

  const parseMarginBottom = (): string => {
    const imageWidth: number = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--gutter")
        .slice(0, -2),
      10
    );

    const lineHeight: number = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--one-line")
        .slice(0, -2),
      10
    );

    const imageHeight = (imageWidth / 16) * 9;

    const lines = Math.ceil(imageHeight / lineHeight);

    return `${lines * lineHeight - imageHeight}px`;
  };

  return (
    <Img
      fluid={review.markdown.backdrop?.childImageSharp.fluid}
      alt={`A still from ${review.movie.title}`}
      style={isSSR ? undefined : { marginBottom: parseMarginBottom() }}
      loading="eager"
    />
  );
}

const DirectorsWrap = styled.span`
  color: var(--color-text-secondary);
  display: block;
  font-size: 14px;
  letter-spacing: 0.25px;
  margin-top: 1em;
`;

function Directors({ review }: Props["data"]): JSX.Element {
  return (
    <DirectorsWrap>
      D:{" "}
      {review.movie.directors.map((director) => director.fullName).join(" & ")}
    </DirectorsWrap>
  );
}

function YearAndRuntime({ review }: Props["data"]): JSX.Element {
  return (
    <YearAndRuntimeWrap>
      {review.movie.year} <YearAndRuntimeDivider>|</YearAndRuntimeDivider>{" "}
      {review.movie.runtimeMinutes}
      &thinsp;mins.
    </YearAndRuntimeWrap>
  );
}

const Review = styled.article`
  border-top: 1px solid var(--color-border);
  margin: 30px 0;
  padding: 20px 0 0;

  @media only screen and (min-width: ${breakpoints.max}) {
    display: flex;
    margin-top: 16px;
    padding-top: 0;
    position: relative;
  }
`;

const Via = styled.span`
  color: rgba(0, 0, 0, 0.54);
`;

const Date = styled.span``;

const Header = styled.header`
  padding: 0;
`;

const List = styled.ol`
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export default function ReviewTemplate({ data }: Props): JSX.Element {
  return (
    <Layout>
      <ReviewSection>
        <ReviewImage review={data.review} />
        <Header>
          <Title>{data.review.movie.title}</Title>
          <AkaTitles review={data.review} />
          <Directors review={data.review} />
          <YearAndRuntime review={data.review} />
        </Header>
        <List>
          <ListItem>
            <Review>
              <Meta>
                <ReviewGrade grade={data.review.grade} width={95} height={95} />
                <Date>
                  {moment.utc(data.review.date).format("ddd MMM Do, YYYY")}{" "}
                </Date>
                <Via>via Shudder</Via>
              </Meta>
              <Main>{reviewContent(data.review)}</Main>
            </Review>
          </ListItem>
        </List>
      </ReviewSection>
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
