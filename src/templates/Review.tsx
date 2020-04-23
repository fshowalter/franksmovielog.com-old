import { graphql, Link } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import parse from 'html-react-parser';
import pluralize from 'pluralize';
import React from 'react';
import remark from 'remark';

import styled from '@emotion/styled';

import { bodyTextMixin } from '../components/GlobalStyles';
import Grade from '../components/Grade';
import Layout from '../components/Layout';
import SingleColumn from '../components/SingleColumn';

const remarkHTML = require("remark-html");

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
        imdb_id: string;
        title: string;
        year: string;
        runtime_minutes: number;
        original_title: string;
        directors: {
          full_name: string;
        }[];
        countries: {
          names: [string];
        };
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
  &:after {
    content: ": ";
  }
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

const ReviewMetaAkaTitles = ({ review }: Props["data"]) => {
  if (review.movie.original_title === review.movie.title) {
    return null;
  }

  return (
    <ReviewMetaAkaWrap>
      <ReviewMetaAkaHeading>aka</ReviewMetaAkaHeading>
      <ReviewMetaAkaTitle> {review.movie.original_title}</ReviewMetaAkaTitle>
    </ReviewMetaAkaWrap>
  );
};

const ReviewCountries = ({
  names,
}: Props["data"]["review"]["movie"]["countries"]) => {
  const countryNames = names.map((name) => {
    return (
      <span key={name}>
        {name} <ReviewMetaDivider>|</ReviewMetaDivider>{" "}
      </span>
    );
  });

  return <>{countryNames}</>;
};

const ReviewMeta = ({ review }: Props["data"]) => {
  return (
    <ReviewMetaWrap>
      <ReviewMetaTitle>
        {review.movie.title} ({review.movie.year})
      </ReviewMetaTitle>
      <ReviewMetaDirector>
        D:{" "}
        {review.movie.directors
          .map((director) => director.full_name)
          .join(" & ")}
      </ReviewMetaDirector>
      <ReviewMetaDetails>
        {review.movie.year} <ReviewMetaDivider>|</ReviewMetaDivider>{" "}
        <ReviewCountries names={review.movie.countries.names} />
        {review.movie.runtime_minutes}
        &thinsp;mins.
      </ReviewMetaDetails>
      <ReviewMetaAkaTitles review={review} />
      <ReviewMetaSeen>
        I've seen it{" "}
        <Link to={`/viewings/?imdb_id=${review.movie.imdb_id}`}>
          {pluralize("time", review.movie.viewings.length, true)}
        </Link>
      </ReviewMetaSeen>
    </ReviewMetaWrap>
  );
};

const ReviewTags = () => {
  return (
    <ReviewTagsWrap>
      <ReviewTagsList></ReviewTagsList>
    </ReviewTagsWrap>
  );
};

const reviewContent = (review: Props["data"]["review"]) => {
  let content = `${review.prettyDate.toUpperCase()}&#8212;${review.markdown.rawMarkdownBody.trim()}\n\n**Grade: ${
    review.grade
  }**`;

  return parse(remark().use(remarkHTML).processSync(content).toString());
};

const ReviewTemplate = ({ location, data }: Props) => {
  console.log(data);
  return (
    <Layout location={location}>
      <SingleColumn>
        <Article>
          <Img
            fluid={data.review.markdown.backdrop?.childImageSharp.fluid}
            alt={`A still from ${data.review.movie.title}`}
          />
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
