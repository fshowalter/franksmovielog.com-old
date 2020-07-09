import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import React from "react";
import PropTypes from "prop-types";

import Grade from "../components/Grade";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import ReviewLink from "../components/ReviewLink";

export default function HomeTemplate({ pageContext, data }) {
  return (
    <Layout>
      <main className="home">
        <ol className="home-post_list">
          {data.updates.nodes.map((review) => {
            return (
              <li className="home-post_list_item" value={review.sequence}>
                <h2 className="home-post_heading">
                  <ReviewLink review={review} />
                </h2>
                <div className="home-post_image_wrap">
                  <Img
                    fluid={review.backdrop.childImageSharp.fluid}
                    alt={`A still from ${review.title} (${review.year})`}
                  />
                </div>
                <Grade grade={review.grade} className="home-review_grade" />
                <div className="home-post_excerpt">{review.review_content}</div>
                <Link
                  class="home-post_continue_reading"
                  to={`/reviews/${review.slug}/`}
                >
                  Continue Reading
                </Link>
              </li>
            );
          })}
        </ol>
        <Pagination
          currentPage={pageContext.currentPage}
          urlRoot="/"
          limit={pageContext.limit}
          numberOfItems={pageContext.numberOfItems}
        />
      </main>
    </Layout>
  );
}

HomeTemplate.propTypes = {
  pageContext: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    skip: PropTypes.number.isRequired,
    numberOfItems: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    updates: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          frontmatter: PropTypes.shape({
            date: PropTypes.string.isRequired,
            grade: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            year: PropTypes.number.isRequired,
            sequence: PropTypes.number.isRequired,
          }).isRequired,
          backdrop: PropTypes.shape({
            childImageSharp: PropTypes.shape({
              fluid: PropTypes.shape({
                src: PropTypes.string.isRequired,
              }),
            }),
          }),
          html: PropTypes.string.isRequired,
        })
      ),
    }),
  }).isRequired,
};

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!, $imdbIds: [String]) {
    updates: allMarkdownRemark(
      sort: { fields: [frontmatter___sequence], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        frontmatter {
          date(formatString: "DD MMM YYYY")
          grade
          slug
          sequence
          imdb_id
        }
        backdrop {
          childImageSharp {
            fluid(toFormat: JPG, jpegQuality: 75) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        html
      }
    }

    watchlistTitles: allWatchlistTitlesJson(
      filter: { imdb_id: { in: $imdbIds } }
    ) {
      nodes {
        imdb_id
        directorNamesConcat
        writerNamesConcat
        performerNamesConcat
      }
    }
  }
`;
