import { graphql } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import moment from "moment";
import React from "react";
import { renderToString } from "react-dom/server";
import remark from "remark";
import remarkHTML from "remark-html";

import styled from "@emotion/styled";

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
`;

const Aside = styled.aside`
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
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  line-height: 1.5;
  max-width: 66ch;
  order: 3;
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

const ReviewMetaDirector = styled.span`
  color: #765;
  display: block;
  margin-top: 1em;
`;

const ReviewMetaDetails = styled.span`
  color: #765;
  display: block;
`;

const ReviewMetaAkaWrap = styled.div`
  padding-bottom: 1em;
`;

const ReviewMetaAkaHeading = styled.div``;

const ReviewMetaAkaTitle = styled.div`
  display: block;
  font-size: 18px;
  font-style: italic;
  white-space: nowrap;

  &:nth-of-type(2) {
    display: inline;
  }

  @media only screen and (min-width: 40.625em) {
    display: inline;

    &:after {
      color: $color_accent;
      content: "|";
      white-space: normal;
    }

    &:last-of-type:after {
      content: "";
    }
  }
`;

const ReviewMetaDivider = styled.span`
  color: $color_accent;
`;

const InlineGrade = styled(Grade)`
  display: inline-block;
  height: auto;
  margin-right: 2px;
  position: relative;
  top: 3px;
  width: 95px;
`;

const ReviewMetaAkaTitles: React.FC<Props["data"]> = ({
  review,
}: Props["data"]) => {
  if (review.movie.originalTitle === review.movie.title) {
    return null;
  }

  return (
    <ReviewMetaAkaWrap>
      <ReviewMetaAkaHeading>
        aka:{" "}
        <ReviewMetaAkaTitle> {review.movie.originalTitle}</ReviewMetaAkaTitle>
      </ReviewMetaAkaHeading>
    </ReviewMetaAkaWrap>
  );
};

const CWrap = styled.div`
  border-top: solid 1px #eee;
  display: flex;
  margin-top: 1em;
`;

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

const Via = styled.span``;

export default function ReviewTemplate({ data }: Props): JSX.Element {
  return (
    <Layout>
      <Article>
        {reviewImage(data.review)}
        <Title>{data.review.movie.title}</Title>
        <ReviewMetaAkaTitles review={data.review} />
        <ReviewMetaDirector>
          D:{" "}
          {data.review.movie.directors
            .map((director) => director.fullName)
            .join(" & ")}
        </ReviewMetaDirector>
        <ReviewMetaDetails>
          {data.review.movie.year} <ReviewMetaDivider>|</ReviewMetaDivider>{" "}
          {data.review.movie.runtimeMinutes}
          &thinsp;mins.
        </ReviewMetaDetails>
        <CWrap>
          <Main>{reviewContent(data.review)}</Main>
          <Aside>
            {moment.utc(data.review.date).format("dddd, MMMM Do YYYY")}{" "}
            <Via>via Shudder</Via>
          </Aside>
        </CWrap>
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
