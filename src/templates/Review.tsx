import { graphql } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import marked from "marked";
import moment from "moment";
import React from "react";
import { renderToString } from "react-dom/server";

import styled from "@emotion/styled";

import { bodyTextMixin } from "../components/GlobalStyles";
import Grade from "../components/Grade";
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
`;

const DateAndVia = styled.aside`
  border-right: solid 1px #eee;
  color: rgba(0, 0, 0, 0.8);
  font-size: 16px;
  letter-spacing: 0.25px;
  line-height: 1.4;
  margin-right: 30px;
  min-width: 170px;
  order: 2;
  padding-right: 30px;

  @media only screen and (min-width: 71.25em) {
    order: 1;
    padding-right: 20px;
    padding-top: 23px;
    position: relative;
    width: 220px;

    &:before {
      background: #eee;
      content: "";
      height: 1px;
      position: absolute;
      right: 0px;
      top: 34px;
      width: 20px;
      z-index: -1;
    }

    &:after {
      background: #fdfdfd;
      border: #e9e7e0 1px solid;
      border-radius: 100%;
      content: "";
      display: block;
      height: 7px;
      position: absolute;
      right: -5px;
      top: 30px;
      width: 7px;
      z-index: 500;
    }
  }
`;

const Main = styled.main`
  border-top: 1px solid #eee;
  color: rgba(0, 0, 0, 0.87);
  font-size: 20px;
  line-height: 1.5;
  margin-top: 30px;
  max-width: 66ch;
  order: 3;
  padding-top: 30px;

  p {
    ${bodyTextMixin};
  }

  @media only screen and (min-width: 71.25em) {
    border-top: none;
    margin-top: 0;
    order: 2;
    padding-top: 20px;
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
  color: rgba(0, 0, 0, 0.54);
  display: block;
`;

const AkaWrap = styled.div`
  color: rgba(0, 0, 0, 0.54);
  padding-bottom: 1em;
  padding-top: 0.25em;
`;

const AkaTitle = styled.div`
  color: rgba(0, 0, 0, 0.87);
  display: inline-block;
  font-size: 18px;
  font-style: italic;
  white-space: nowrap;
`;

const YearAndRuntimeDivider = styled.span`
  color: #eee;
`;

const InlineGrade = styled(Grade)`
  display: inline-block;
  height: auto;
  margin-right: 2px;
  position: relative;
  top: 3px;
  width: 95px;
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
  const content = `${renderToString(
    <InlineGrade grade={review.grade} width={95} height={95} />
  )}&#8212;${review.markdown.rawMarkdownBody.trim()}`;

  return parse(marked(content, { pedantic: true }).toString());
};

const ReviewImage = styled(Img)`
  margin: 0 -20px;
`;

const reviewImage: React.FC<Props["data"]["review"]> = (
  review: Props["data"]["review"]
) => {
  if (!review?.markdown?.backdrop) {
    return null;
  }

  return (
    <ReviewImage
      fluid={review.markdown.backdrop?.childImageSharp.fluid}
      alt={`A still from ${review.movie.title}`}
      loading="eager"
    />
  );
};

const DirectorsWrap = styled.span`
  color: rgba(0, 0, 0, 0.54);
  display: block;
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
  @media only screen and (min-width: 71.25em) {
    border-top: solid 1px #eee;
    display: flex;
    margin-top: 16px;
  }
`;

const Via = styled.span`
  color: rgba(0, 0, 0, 0.54);
  display: block;
`;

export default function ReviewTemplate({ data }: Props): JSX.Element {
  return (
    <Layout>
      <Wrap>
        {reviewImage(data.review)}
        <Title>{data.review.movie.title}</Title>
        <AkaTitles review={data.review} />
        <Directors review={data.review} />
        <YearAndRuntime review={data.review} />
        <Review>
          <Main>{reviewContent(data.review)}</Main>
          <DateAndVia>
            {moment.utc(data.review.date).format("ddd MMM Do YYYY")}{" "}
            <Via>via Shudder</Via>
          </DateAndVia>
        </Review>
      </Wrap>
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
