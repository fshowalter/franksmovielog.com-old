import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import React from "react";
import PropTypes, { arrayOf } from "prop-types";

import Grade from "../components/Grade";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import ReviewLink from "../components/ReviewLink";

const Movie = PropTypes.shape({
  imdb_id: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.number,
});

const WatchlistTitle = PropTypes.shape({
  directors: arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  performers: arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  writers: arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  collections: arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
});

function WatchlistLinks({ watchlistTitle }) {
  if (!watchlistTitle) {
    return null;
  }

  return (
    <ul>
      {watchlistTitle.collections.map((collection) => {
        return (
          <Link to={`/watchlist/collections/${collection.slug}/`}>
            {collection.name}
          </Link>
        );
      })}
      {watchlistTitle.directors.map((director) => {
        return (
          <Link to={`/watchlist/directors/${director.slug}/`}>
            {director.name}
          </Link>
        );
      })}
      {watchlistTitle.performers.map((performer) => {
        return (
          <Link to={`/watchlist/cast/${performer.slug}/`}>
            {performer.name}
          </Link>
        );
      })}
      {watchlistTitle.writers.map((writer) => {
        return (
          <Link to={`/watchlist/writers/${writer.slug}/`}>{writer.name}</Link>
        );
      })}
    </ul>
  );
}

WatchlistLinks.propTypes = {
  watchlistTitle: WatchlistTitle,
};

WatchlistLinks.defaultProps = {
  watchlistTitle: null,
};

function PostListItem({ post, value }) {
  return (
    <li className="home-post_list_item" value={value}>
      <div>{post.frontmatter.date}</div>
      <div className="home-post_image_wrap">
        <Img fluid={post.backdrop.childImageSharp.fluid} alt="" />
      </div>
      <h2 className="home-post_heading">{post.frontmatter.title}</h2>
      <div
        className="home-post_excerpt"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: post.html,
        }}
      />
      <Link class="home-post_continue_reading" to={post.frontmatter.slug}>
        Continue Reading
      </Link>
    </li>
  );
}

PostListItem.propTypes = {
  value: PropTypes.number.isRequired,
  post: PropTypes.shape({
    frontmatter: PropTypes.shape({
      date: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
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
  }).isRequired,
};

function ReviewListItem({ review, movies, value, watchlistTitles }) {
  const movie = movies.find(
    (item) => item.imdb_id === review.frontmatter.imdb_id
  );

  const watchlistTitle = watchlistTitles.find(
    (title) => title.imdb_id === review.frontmatter.imdb_id
  );

  return (
    <li className="home-review_list_item" value={value}>
      <div>{review.frontmatter.date}</div>
      <div className="home-review_image_wrap">
        <Img
          fluid={review.backdrop.childImageSharp.fluid}
          alt={`A still from ${movie.title} (${movie.year})`}
        />
      </div>
      <h2 className="home-review_heading">
        #{review.frontmatter.sequence}.{" "}
        <ReviewLink imdbId={review.frontmatter.imdb_id}>
          <>
            {movie.title}{" "}
            <span className="home-review_title_year">{movie.year}</span>
          </>
        </ReviewLink>
      </h2>
      <Grade grade={review.frontmatter.grade} className="home-review_grade" />
      <div
        className="home-review_excerpt"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: review.html,
        }}
      />
      <Link
        class="home-review_continue_reading"
        to={`/reviews/${review.frontmatter.slug}/`}
      >
        Continue Reading
      </Link>
      <WatchlistLinks watchlistTitle={watchlistTitle} />
    </li>
  );
}

ReviewListItem.propTypes = {
  value: PropTypes.number.isRequired,
  movies: PropTypes.arrayOf(Movie).isRequired,
  watchlistTitles: PropTypes.arrayOf(WatchlistTitle).isRequired,
  review: PropTypes.shape({
    frontmatter: PropTypes.shape({
      imdb_id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      grade: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
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
  }).isRequired,
};

export default function HomeTemplate({ pageContext, data }) {
  return (
    <Layout>
      <main className="home">
        <ol className="home-post_list">
          {data.updates.nodes.map((update, index) => {
            const listItemValue =
              data.updates.nodes.length - pageContext.skip - index;

            if (update.postType === "review") {
              return (
                <ReviewListItem
                  review={update}
                  movies={data.movie.nodes}
                  value={listItemValue}
                  watchlistTitles={data.watchlistTitle.nodes}
                />
              );
            }
            if (update.postType === "post") {
              return <PostListItem post={update} value={listItemValue} />;
            }
            return null;
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
          postType: PropTypes.oneOf(["review", "post"]),
        })
      ),
    }),
    watchlistTitle: PropTypes.shape({
      nodes: PropTypes.arrayOf(WatchlistTitle),
    }),
    movie: PropTypes.shape({
      nodes: PropTypes.arrayOf(Movie),
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
        postType
        frontmatter {
          date(formatString: "DD MMM YYYY")
          grade
          slug
          title
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

    movie: allMoviesJson(filter: { imdb_id: { in: $imdbIds } }) {
      nodes {
        imdb_id
        title
        year
      }
    }

    watchlistTitle: allWatchlistTitlesJson(
      filter: { imdb_id: { in: $imdbIds } }
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
