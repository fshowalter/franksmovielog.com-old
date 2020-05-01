import { graphql } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import moment from "moment";
import React from "react";
import { renderToString } from "react-dom/server";
import remark from "remark";
import remarkHTML from "remark-html";

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

const Article = styled.article`
  max-width: 900px;
  padding: 0 20px 30px;

  p {
    ${bodyTextMixin};
  }
`;

const DateAndVia = styled.aside`
  border-right: solid 1px #eee;
  color: rgba(0, 0, 0, 0.54);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 12px;
  line-height: 1.4;
  margin-right: 30px;
  min-width: 170px;
  order: 2;
  padding-right: 30px;
  padding-top: 22px;
`;

const Main = styled.main`
  border-top: 1px solid #eee;
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  line-height: 1.5;
  margin-top: 30px;
  max-width: 66ch;
  order: 3;
  padding-top: 30px;
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

  return parse(remark().use(remarkHTML).processSync(content).toString());
};

const ReviewImage = styled(Img)`
  margin: 0 -20px;
`;

const reviewImage: React.FC<Props["data"]["review"]> = (
  review: Props["data"]["review"]
) => {
  if (!review.markdown.backdrop) {
    return null;
  }

  return (
    <ReviewImage
      fluid={review.markdown.backdrop?.childImageSharp.fluid}
      alt={`A still from ${review.movie.title}`}
    />
  );
};

const DirectorsWrap = styled.span`
  color: rgba(0, 0, 0, 0.54);
  display: block;
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

const Via = styled.span``;

export default function Review({ data }: Props): JSX.Element {
  return (
    <Layout>
      <Article>
        {reviewImage(data.review)}
        <Title>{data.review.movie.title}</Title>
        <AkaTitles review={data.review} />
        <Directors review={data.review} />
        <YearAndRuntime review={data.review} />
        <Main>{reviewContent(data.review)}</Main>
        <DateAndVia>
          {moment.utc(data.review.date).format("dddd, MMMM Do YYYY")}{" "}
          <Via>via Shudder</Via>
        </DateAndVia>
      </Article>
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
