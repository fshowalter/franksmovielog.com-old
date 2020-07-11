import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import React from "react";
import PropTypes from "prop-types";

import Grade from "../components/Grade";
import Layout from "../components/Layout";
import toSentenceArray from "../utils/to-sentence-array";

function CastList({ principalCastIds, allCast, watchlistTitle }) {
  const castIds = new Set(principalCastIds.split(","));
  const watchlistPerformerLinks = {};

  if (watchlistTitle) {
    watchlistTitle.performers.forEach((performer) => {
      castIds.add(performer.imdb_id);
      watchlistPerformerLinks[performer.imdb_id] = (
        <Link to={`/watchlist/cast/${performer.slug}/`}>{performer.name}</Link>
      );
    });
  }

  const cast = allCast.filter((person) => castIds.has(person.person_imdb_id));

  return (
    <>
      Starring{" "}
      {toSentenceArray(
        cast.map((person) => {
          const link = watchlistPerformerLinks[person.person_imdb_id];
          return link || person.name;
        })
      )}
    </>
  );
}

CastList.propTypes = {
  principalCastIds: PropTypes.string.isRequired,
  allCast: PropTypes.arrayOf(
    PropTypes.shape({
      person_imdb_id: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  watchlistTitle: PropTypes.shape({
    performers: PropTypes.arrayOf(
      PropTypes.shape({
        imdb_id: PropTypes.string,
      })
    ),
  }),
};

CastList.defaultProps = {
  watchlistTitle: null,
};

export default function Review({ data }) {
  const movie = data.movie.nodes[0];
  const review = data.review.nodes[0];
  const watchlistTitle = data.watchlistTitle.nodes[0];

  return (
    <Layout>
      <main className="review">
        <Img
          fluid={review.backdrop.childImageSharp.fluid}
          alt={`A still from ${movie.title} (${movie.year})`}
        />
        <h1>{movie.title}</h1>
        <div className="review-title_meta">
          <ul>
            <li>
              Directed by{" "}
              {toSentenceArray(
                data.director.nodes.map((director) => director.name)
              )}
            </li>
            <li>{movie.year}</li>
            <li>{movie.runtime_minutes} minutes</li>
            <li>
              <CastList
                principalCastIds={movie.principal_cast_ids}
                allCast={data.cast.nodes}
                watchlistTitle={watchlistTitle}
              />
            </li>
          </ul>
        </div>
        <Grade
          grade={review.frontmatter.grade}
          className="review-review_grade"
        />
        <article
          className="reviews-review_content"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: review.html,
          }}
        />
      </main>
    </Layout>
  );
}

Review.propTypes = {
  pageContext: PropTypes.shape({
    imdbId: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    director: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          full_name: PropTypes.string,
        })
      ),
    }),
    cast: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          full_name: PropTypes.string,
        })
      ),
    }),
    review: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          frontmatter: PropTypes.shape({
            imdb_id: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            grade: PropTypes.string.isRequired,
            sequence: PropTypes.number.isRequired,
          }).isRequired,
          backdrop: PropTypes.shape({
            childImageSharp: PropTypes.shape({
              fluid: PropTypes.shape({
                src: PropTypes.string.isRequired,
              }),
            }),
          }).isRequired,
          html: PropTypes.string.isRequired,
        })
      ),
    }),
    movie: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          imdb_id: PropTypes.string,
          title: PropTypes.string,
          year: PropTypes.number,
          runtime_minutes: PropTypes.number,
          principal_cast_ids: PropTypes.string,
        })
      ),
    }),
    watchlistTitle: PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          performers: PropTypes.arrayOf(
            PropTypes.shape({
              imdb_id: PropTypes.string,
              name: PropTypes.string,
              slug: PropTypes.string,
            })
          ),
        })
      ),
    }),
  }).isRequired,
};

export const pageQuery = graphql`
  query($imdbId: String) {
    review: allMarkdownRemark(
      sort: { fields: [frontmatter___sequence], order: ASC }
      filter: { frontmatter: { imdb_id: { eq: $imdbId } } }
    ) {
      nodes {
        frontmatter {
          date(formatString: "DD MMM YYYY")
          grade
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

    movie: allMoviesJson(filter: { imdb_id: { eq: $imdbId } }) {
      nodes {
        imdb_id
        title
        year
        runtime_minutes
        principal_cast_ids
      }
    }

    director: allDirectingCreditsJson(
      sort: { fields: [sequence], order: ASC }
      filter: { movie_imdb_id: { eq: $imdbId } }
    ) {
      nodes {
        name
        sequence
        person_imdb_id
      }
    }

    cast: allPerformingCreditsJson(
      sort: { fields: [sequence], order: ASC }
      filter: { movie_imdb_id: { eq: $imdbId } }
    ) {
      nodes {
        name
        sequence
        person_imdb_id
      }
    }

    watchlistTitle: allWatchlistTitlesJson(
      filter: { imdb_id: { eq: $imdbId } }
    ) {
      nodes {
        imdb_id
        directors {
          name
          slug
        }
        writers {
          name
          slug
        }
        performers {
          imdb_id
          name
          slug
        }
        collections {
          name
          slug
        }
      }
    }
  }
`;
