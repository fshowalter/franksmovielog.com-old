import { graphql, Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import pluralize from "pluralize";
import React from "react";
import remark from "remark";
import remarkHTML from "remark-html";

import styled from "@emotion/styled";

import { bodyTextMixin } from "../components/GlobalStyles";
import Grade from "../components/Grade";
import Layout from "../components/Layout";
import SingleColumn from "../components/SingleColumn";

const Title = styled.h1`
  font-size: 32px;
  line-height: 1.1;
  margin-bottom: 0;
  padding: 30px 20px 20px;
  text-align: center;

  @media only screen and (min-width: 35em) {
    font-size: 42px;
  }
`;

const Article = styled.article`
  padding-bottom: 30px;
`;

const StyledGrade = styled(Grade)`
  display: block;
  height: auto;
  margin: 10px auto 30px;
  max-width: 150px;
  width: 33%;
`;

const ContentWrap = styled.div`
  margin: 0 auto;
  max-width: 740px;
  padding: 0 20px;

  blockquote {
    font-style: italic;
  }

  p {
    ${bodyTextMixin}
  }

  .footnotes {
    margin: 0 auto;
    max-width: 700px;
    padding-top: 20px;
    position: relative;

    &:before {
      background-color: var(--color-primary);
      content: "";
      display: block;
      height: 1px;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
    }

    hr {
      display: none;
    }

    ol {
      padding: 0 20px;
    }

    p {
      font-size: 18px;
    }
  }

  @media (min-width: 48em) {
    max-width: 80%;
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

const ReviewMetaWrap = styled.div`
  ${bodyTextMixin}
  border-top: 1px solid var(--color-primary);
  margin: 40px auto 20px;
  padding: 20px 0;
`;

const ReviewMetaTitle = styled.span`
  display: block;
  font-weight: bold;
`;

const ReviewMetaDirector = styled.span`
  display: block;
`;

const ReviewMetaDetails = styled.span`
  display: block;
`;

const ReviewMetaAkaWrap = styled.div``;

const ReviewMetaAkaHeading = styled.div`
  /* &:after {
    content: ": ";
  } */
`;

const ReviewMetaAkaTitle = styled.div`
  display: block;
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

const ReviewMetaSeen = styled.span`
  display: block;
`;

const ReviewMetaDivider = styled.span`
  color: $color_accent;
`;

const ReviewTagsWrap = styled.div`
  line-height: 1.4;
  margin: 0 auto;
  max-width: 700px;
`;

const ReviewTagsList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0 0 40px;
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

const ReviewMeta: React.FC<Props["data"]> = ({ review }: Props["data"]) => {
  return (
    <ReviewMetaWrap>
      <ReviewMetaTitle>
        {review.movie.title} ({review.movie.year})
      </ReviewMetaTitle>
      <ReviewMetaAkaTitles review={review} />
      <ReviewMetaDirector>
        D:{" "}
        {review.movie.directors
          .map((director) => director.fullName)
          .join(" & ")}
      </ReviewMetaDirector>
      <ReviewMetaDetails>
        {review.movie.year} <ReviewMetaDivider>|</ReviewMetaDivider>{" "}
        {review.movie.runtimeMinutes}
        &thinsp;mins.
      </ReviewMetaDetails>
      <ReviewMetaSeen>
        I&apos;ve seen it{" "}
        <Link to={`/viewings/?imdb_id=${review.movie.imdbId}`}>
          {pluralize("time", review.movie.viewings.length, true)}
        </Link>
      </ReviewMetaSeen>
    </ReviewMetaWrap>
  );
};

const ReviewTags: React.FC = () => {
  return (
    <ReviewTagsWrap>
      <ReviewTagsList />
    </ReviewTagsWrap>
  );
};

const reviewContent = (
  review: Props["data"]["review"]
): JSX.Element | JSX.Element[] => {
  const content = `${review.prettyDate.toUpperCase()}&#8212;${review.markdown.rawMarkdownBody.trim()}\n\n**Grade: ${
    review.grade
  }**`;

  return parse(remark().use(remarkHTML).processSync(content).toString());
};

const reviewImage: React.FC<Props["data"]["review"]> = (
  review: Props["data"]["review"]
) => {
  if (!review.markdown.backdrop) {
    return null;
  }

  return (
    <Img
      fluid={review.markdown.backdrop?.childImageSharp.fluid}
      alt={`A still from ${review.movie.title}`}
    />
  );
};

const ReviewTemplate: React.FC<Props> = ({ location, data }: Props) => {
  return (
    <Layout location={location}>
      <SingleColumn>
        <Article>
          {reviewImage(data.review)}
          <Title>{data.review.movie.title}</Title>
          <StyledGrade grade={data.review.grade} />
          <ContentWrap>
            {reviewContent(data.review)}
            <ReviewMeta review={data.review} />
          </ContentWrap>
          <ReviewTags />
        </Article>
      </SingleColumn>
    </Layout>
  );
};

export default ReviewTemplate;

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
