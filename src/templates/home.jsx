import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import React from "react";
import PropTypes, { arrayOf } from "prop-types";

import Grade from "../components/Grade";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import ReviewLink from "../components/ReviewLink";
import styles from "./home.module.scss";

function WatchlistItem({ to, children }) {
  return (
    <li className={styles.list_item_watchlist_item}>
      <Link to={to}>{children}</Link>
    </li>
  );
}

WatchlistItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

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
    <div className={styles.list_item_watchlist}>
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        className={styles.list_item_watchlist_icon}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z"
        />
        <path
          fill-rule="evenodd"
          d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
        />
      </svg>
      <ul>
        {watchlistTitle.collections.map((collection) => {
          return (
            <WatchlistItem to={`/watchlist/collections/${collection.slug}/`}>
              {collection.name}
            </WatchlistItem>
          );
        })}
        {watchlistTitle.directors.map((director) => {
          return (
            <WatchlistItem to={`/watchlist/directors/${director.slug}/`}>
              {director.name}
            </WatchlistItem>
          );
        })}
        {watchlistTitle.performers.map((performer) => {
          return (
            <WatchlistItem to={`/watchlist/cast/${performer.slug}/`}>
              {performer.name}
            </WatchlistItem>
          );
        })}
        {watchlistTitle.writers.map((writer) => {
          return (
            <WatchlistItem to={`/watchlist/writers/${writer.slug}/`}>
              {writer.name}
            </WatchlistItem>
          );
        })}
      </ul>
    </div>
  );
}

WatchlistLinks.propTypes = {
  watchlistTitle: WatchlistTitle,
};

WatchlistLinks.defaultProps = {
  watchlistTitle: null,
};

function PostListItem({ post, index, value }) {
  return (
    <li
      className={`home-post_list_item ${
        index === 0 ? "home-post_list_item--first" : ""
      }`}
      value={value}
    >
      <div>{post.frontmatter.date}</div>
      <div className="home-post_image_wrap">
        <Img fluid={post.backdrop.childImageSharp.fluid} alt="" />
      </div>
      <h2 className={styles.heading}>
        <Link to={post.frontmatter.slug}>{post.frontmatter.title}</Link>
      </h2>
      <div
        className="home-post_excerpt"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: post.frontmatter.excerpt || post.firstParagraph,
        }}
      />
      {(post.frontmatter.excerpt || post.numberOfParagraphs > 1) && (
        <Link class="home-post_continue_reading" to={post.frontmatter.slug}>
          Continue Reading
        </Link>
      )}
    </li>
  );
}

PostListItem.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  post: PropTypes.shape({
    frontmatter: PropTypes.shape({
      date: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      sequence: PropTypes.number.isRequired,
    }).isRequired,
    backdrop: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fluid: PropTypes.shape({
          src: PropTypes.string.isRequired,
        }),
      }),
    }).isRequired,
    firstParagraph: PropTypes.string.isRequired,
    numberOfParagraphs: PropTypes.number.isRequired,
  }).isRequired,
};

function ReviewListItem({ review, movies, index, value, watchlistTitles }) {
  const movie = movies.find(
    (item) => item.imdb_id === review.frontmatter.imdb_id
  );

  const watchlistTitle = watchlistTitles.find(
    (title) => title.imdb_id === review.frontmatter.imdb_id
  );

  return (
    <li
      className={`${styles.list_item} ${
        index === 0 ? styles.list_item_first : ""
      }`}
      value={value}
    >
      <div className="home-review_image_wrap">
        <Img
          fluid={review.backdrop.childImageSharp.fluid}
          alt={`A still from ${movie.title} (${movie.year})`}
        />
      </div>
      <div className={styles.list_item_content}>
        <h2 className={styles.list_item_heading}>
          <span className={styles.list_item_heading_counter}>
            #{review.frontmatter.sequence}.{" "}
          </span>
          <ReviewLink imdbId={review.frontmatter.imdb_id}>
            <>
              {movie.title}{" "}
              <span className={styles.list_item_heading_review_year}>
                {movie.year}
              </span>
            </>
          </ReviewLink>
        </h2>
        <Grade
          grade={review.frontmatter.grade}
          className={styles.list_item_grade}
        />
        <div
          className={styles.list_item_excerpt}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: review.firstParagraph,
          }}
        />
        {review.numberOfParagraphs > 1 && (
          <Link
            className={styles.list_item_continue_reading}
            to={`/reviews/${review.frontmatter.slug}/`}
          >
            Continue Reading
          </Link>
        )}
        <WatchlistLinks watchlistTitle={watchlistTitle} />
      </div>
      <div className={styles.list_item_date}>
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.list_item_date_icon}
        >
          <path
            fill-rule="evenodd"
            d="M14 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"
          />
          <path
            fill-rule="evenodd"
            d="M14 2H2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v2h16V3a2 2 0 0 0-2-2H2z"
          />
          <path
            fill-rule="evenodd"
            d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z"
          />
        </svg>
        {review.frontmatter.date}
      </div>
    </li>
  );
}

ReviewListItem.propTypes = {
  index: PropTypes.number.isRequired,
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
    firstParagraph: PropTypes.string.isRequired,
    numberOfParagraphs: PropTypes.number.isRequired,
  }).isRequired,
};

export default function HomeTemplate({ pageContext, data }) {
  return (
    <Layout>
      <main className={styles.container}>
        <ol className="home-post_list">
          {data.updates.nodes.map((update, index) => {
            const listItemValue =
              data.updates.nodes.length - pageContext.skip - index;

            if (update.postType === "review") {
              return (
                <ReviewListItem
                  index={index}
                  review={update}
                  movies={data.movie.nodes}
                  value={listItemValue}
                  watchlistTitles={data.watchlistTitle.nodes}
                />
              );
            }
            if (update.postType === "post") {
              return (
                <PostListItem
                  index={index}
                  post={update}
                  value={listItemValue}
                />
              );
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
          excerpt
        }
        backdrop {
          childImageSharp {
            fluid(toFormat: JPG, jpegQuality: 75) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        firstParagraph
        numberOfParagraphs
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
