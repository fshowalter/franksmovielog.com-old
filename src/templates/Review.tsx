import { graphql, Link } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import parse from "html-react-parser";
import moment from "moment";
import pluralize from "pluralize";
import React from "react";
import { renderToString } from "react-dom/server";
import remark from "remark";
import remarkHTML from "remark-html";

import styled from "@emotion/styled";

import hamburger from "../assets/hamburger.svg";
import logo from "../assets/logo-new.inline.svg";
import { bodyTextMixin } from "../components/GlobalStyles";
import Grade from "../components/Grade";

const Title = styled.h1`
  font-size: 32px;
  line-height: 1.1;
  margin-bottom: 0;
  padding: 30px 0 0;
  /* text-align: center; */

  @media only screen and (min-width: 35em) {
    font-size: 42px;
  }
`;

const Article = styled.article`
  font-family: "Charter", "Georgia", "Times New Roman", Times, serif;
  padding-bottom: 30px;
  max-width: 900px;
  flex: 1;
  /* display: flex; */
`;

const Aside = styled.aside`
  order: 2;
  padding-right: 30px;
  margin-right: 30px;
  border-right: solid 1px #eee;
  padding-top: 22px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 12px;
  min-width: 170px;
  color: #765;
  line-height: 1.4;
`;

const Main = styled.main`
  max-width: 66ch;
  order: 3;
  font-size: 18px;
  line-height: 1.5;
  color: #222;
`;

// const StyledGrade = styled(Grade)`
//   display: block;
//   height: auto;
//   margin: 10px auto 30px;
//   max-width: 150px;
//   width: 33%;
// `;

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
  color: #d8c3ad;
`;

const ReviewMetaTitle = styled.span`
  display: block;
  font-weight: bold;
`;

const ReviewMetaDirector = styled.span`
  display: block;
  /* font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif; */
  color: #765;
  margin-top: 1em;
`;

const ReviewMetaDetails = styled.span`
  display: block;
  /* font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif; */
  color: #765;
`;

const ReviewMetaAkaWrap = styled.div`
  padding-bottom: 1em;
`;

const ReviewMetaAkaHeading = styled.div`
  /* &:after {
    content: ": ";
  } */
`;

const ReviewMetaAkaTitle = styled.div`
  display: block;
  font-style: italic;
  white-space: nowrap;
  font-size: 18px;

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

const ReviewMeta: React.FC<Props["data"]> = ({ review }: Props["data"]) => {
  return (
    <ReviewMetaWrap>
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
      {/* <ReviewMetaSeen>
        I&apos;ve seen it{" "}
        <Link to={`/viewings/?imdb_id=${review.movie.imdbId}`}>
          {pluralize("time", review.movie.viewings.length, true)}
        </Link>
      </ReviewMetaSeen> */}
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

const CWrap = styled.div`
  display: flex;
  border-top: solid 1px #eee;
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

const Logo = styled(logo)`
  width: 60px;
  height: 60px;
  margin-bottom: 40px;
  background-color: #579;
  fill: #579;
`;

const Header = styled.header`
  max-width: 150px;
  margin-left: 25px;
  border-left: solid 1px #eee;
  padding: 0 25px;
`;

const Menu = styled.img`
  width: 28px;
  height: 28px;
`;

const Wrap = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 20px auto;
  max-width: 1200px;
  font-family: "Charter", "Georgia", "Times New Roman", Times, serif;
`;

const NavLink = styled(Link)`
  display: block;
  color: #222;
  font-size: 16px;
  line-height: 1.5;
  text-decoration: none;
  border-bottom: 1px solid #eee;
  padding: 10px;
  clear: both;
`;

const TextInputWrap = styled.div`
  border-bottom: solid 1px var(--color-primary);
  margin-bottom: 8px;
  padding-bottom: 7px;
  margin-top: 20px;
`;

const TextInput = styled.input`
  backface-visibility: hidden;
  background-color: #eee;
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  color: #222;
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 16px;
  padding: 10px;
  width: 100%;
  ::placeholder {
    color: var(--color-text-hint);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    font-size: 14px;
    font-weight: normal;
  }
`;

const ReviewTemplate: React.FC<Props> = ({ location, data }: Props) => {
  return (
    <Wrap>
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
            {moment.utc(data.review.date).format("dddd, MMMM Do YYYY")}
            <br />
            via Shudder
          </Aside>
        </CWrap>
      </Article>
      <Header>
        <Logo />
        <NavLink to="/">How I Grade</NavLink>
        <NavLink to="/">Reviews</NavLink>
        <NavLink to="/">Viewing Log</NavLink>
        <NavLink to="/">Watchlist</NavLink>
        <NavLink to="/">Stats</NavLink>
        <TextInputWrap>
          <TextInput placeholder="Search" />
        </TextInputWrap>
      </Header>
    </Wrap>
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
