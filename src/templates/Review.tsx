/* eslint-env node, browser */

import { graphql, Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import marked from "marked";
import moment from "moment";
import React from "react";

import styled from "@emotion/styled";

import Grade from "../components/Grade";
import Layout from "../components/Layout";

const Title = styled.h1``;

const Meta = styled.aside``;

const Main = styled.main``;

const AkaWrap = styled.div``;

const AkaTitle = styled.div``;

const Director = styled.span``;

const ReviewGrade = styled(Grade)``;

const StyledImage = styled(Img)``;

const Review = styled.article``;

const Date = styled.time``;

const Header = styled.header``;

const Year = styled.span``;

const List = styled.ol``;

const ListItem = styled.li``;

const Categories = styled.div``;

const CategoryLink = styled(Link)``;

const MovieDetails = styled.div``;

interface Review {
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
}

interface ReviewComponentProps {
  review: Review;
}

interface Props {
  location: {
    pathname: string;
  };
  data: {
    review: Review;
  };
}

function AkaTitles({ review }: ReviewComponentProps): JSX.Element | null {
  if (review.movie.originalTitle === review.movie.title) {
    return null;
  }

  return (
    <AkaWrap>
      aka: <AkaTitle>{review.movie.originalTitle}</AkaTitle>
    </AkaWrap>
  );
}

function ReviewContent({ review }: ReviewComponentProps): JSX.Element {
  const content = review.markdown.rawMarkdownBody.trim();

  return <>{parse(marked(content, { pedantic: true }).toString())}</>;
}

function ReviewImage({ review }: ReviewComponentProps): JSX.Element | null {
  if (!review?.markdown?.backdrop) {
    return null;
  }

  return (
    <StyledImage
      fluid={review.markdown.backdrop?.childImageSharp.fluid}
      alt={`A still from ${review.movie.title}`}
      loading="eager"
    />
  );
}

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
            <Main>
              <ReviewContent review={data.review} />
            </Main>
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
