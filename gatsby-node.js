const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { resolve } = require("path");

/** @type { import("gatsby").GatsbyNode } */
const config = {};
exports.config = config;

config.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  await graphql(
    `
      query CreatePages {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/reviews/" } }
          sort: { fields: [frontmatter___sequence], order: DESC }
        ) {
          edges {
            node {
              frontmatter {
                slug
              }
            }
          }
        }
      }
    `
  ).then((result) => {
    const resultData = result.data;
    const reviewEdges = resultData.allMarkdownRemark.edges;

    // Create Review pages
    reviewEdges.forEach(({ node }) => {
      createPage({
        path: `/reviews/${node.frontmatter.slug}/`,
        component: require.resolve("./src/templates/Review.tsx"),
        context: {
          slug: node.frontmatter.slug,
          backdrop: `${node.frontmatter.slug}.png`,
        },
      });
    });

    // Create Home pages
    const reviewsPerPage = 20;
    const numPages = Math.ceil(reviewEdges.length / reviewsPerPage);
    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/` : `/page-${i + 1}/`,
        component: require.resolve("./src/templates/Home.tsx"),
        context: {
          limit: reviewsPerPage,
          skip: i * reviewsPerPage,
          numPages,
          currentPage: i + 1,
          moreSkip: i * reviewsPerPage + reviewsPerPage,
          moreLimit: 4,
        },
      });
    });
  });
};

config.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = [
    `type Collection implements Node {
      name: String!
      slug: String!
      movies: [Movie!]! @link(by: "imdbId" from: "movieImdbIds")
    }`,
    `type Director implements Node {
      imdbId: String!
      slug: String
      fullName: String!
      watchlistTitles: [WatchlistTitle!]! @link(by: "directorImdbIds" from: "imdbId")
    }`,
    `type Performer implements Node {
      imdbId: String!
      slug: String
      fullName: String!
      watchlistTitles: [WatchlistTitle!]! @link(by: "performerImdbIds" from: "imdbId")
    }`,
    `type Writer implements Node {
      imdbId: String!
      slug: String
      fullName: String!
      watchlistTitles: [WatchlistTitle!]! @link(by: "writerImdbIds" from: "imdbId")
    }`,
    `type Movie implements Node {
      imdbId: String!
      year: Int!
      title: String!
      originalTitle: String
      runtimeMinutes: Int!
      directors: [Director!]! @link(by: "imdbId", from: "directorImdbIds")
      viewings: [Viewing!]! @link(by: "imdbId", from: "imdbId")
      watchlistTitle: WatchlistTitle @link(by: "imdbId", from: "imdbId")
    }`,
    `type WatchlistTitle implements Node {
      imdbId: String!
      movie: Movie! @link(by: "imdbId", from: "imdbId")
      directors: [Director!]! @link(by: "imdbId", from: "directorImdbIds")
      performers: [Performer!]! @link(by: "imdbId", from: "performerImdbIds")
      writers: [Writer!]! @link(by: "imdbId", from: "writerImdbIds")
      collections: [Collection!]! @link(by: "name", from: "collectionIds")
    }`,
    `type Viewing implements Node {
      imdbId: String!
      movie: Movie! @link(by: "imdbId", from: "imdbId")
    }`,
    `type Page implements Node {
      slug: String!
      title: String!
      date: String!
      markdown: MarkdownRemark! @link(by: "frontmatter.slug", from: "slug")
    }`,
    `type Review implements Node {
      id: ID!
      imdbId: String!
      sequence: String!
      slug: String!
      date: Date @dateformat
      grade: String
      movie: Movie! @link(by: "imdbId", from: "imdbId")
      markdown: MarkdownRemark! @link(by: "frontmatter.imdb_id", from: "imdbId")
    }`,
    // schema.buildObjectType({
    //   name: "WatchlistTitle",
    //   fields: {
    //     performers: {
    //       type: "[Performer!]!",
    //       resolve: (source, args, context, info) => {
    //         if (source.performerImdbIds.length === 0) {
    //           return [];
    //         }

    //         return context.nodeModel
    //           .getAllNodes({ type: "Performer" })
    //           .filter((performerNode) =>
    //             source.performerImdbIds.includes(performerNode.imdbId)
    //           );
    //       },
    //     },
    //   },
    // }),
    schema.buildObjectType({
      name: "MarkdownRemark",
      fields: {
        backdrop: {
          type: "File",
          resolve: (source, args, context) => {
            if (!source.frontmatter || !source.frontmatter.slug) {
              return null;
            }

            const backdropPath = resolve(
              `./src/assets/backdrops/${source.frontmatter.slug}.png`
            );

            if (!backdropPath) {
              return null;
            }

            return context.nodeModel
              .getAllNodes({ type: "File" })
              .find((node) => node.absolutePath === backdropPath);
          },
        },
        firstParagraph: {
          type: "String",
          resolve: (source) => {
            return source.rawMarkdownBody
              ? source.rawMarkdownBody.trim().split("\n\n")[0]
              : "";
          },
        },
      },
    }),
  ];

  createTypes(typeDefs);
};

config.onCreateNode = ({ node, actions, createContentDigest, reporter }) => {
  const { createNode } = actions;

  if (node.internal.type === "Movie") {
    if (!node.imdbId) {
      reporter.panic("null imdbId");
    }
  }

  if (node.internal.type !== `MarkdownRemark`) {
    return;
  }

  if (
    node.fileAbsolutePath.includes("/reviews/") &&
    node.frontmatter &&
    node.frontmatter.imdb_id &&
    node.frontmatter.slug &&
    node.frontmatter.sequence
  ) {
    const data = {
      imdbId: node.frontmatter.imdb_id,
      slug: node.frontmatter.slug,
      sequence: node.frontmatter.sequence,
      date: node.frontmatter.date,
      grade: node.frontmatter.grade,
    };

    createNode({
      ...data,
      // Required fields.
      id: `review-${data.imdbId}`,
      parent: undefined,
      children: [],
      internal: {
        type: `Review`,
        contentDigest: createContentDigest(data),
      },
    });

    return;
  }

  if (
    node.fileAbsolutePath.includes("/pages/") &&
    node.frontmatter.title &&
    node.frontmatter.date &&
    node.frontmatter.slug
  ) {
    const data = {
      slug: node.frontmatter.slug,
      date: node.frontmatter.date,
      title: node.frontmatter.title,
    };

    createNode({
      ...data,
      // Required fields.
      id: `page-${data.slug}`,
      parent: undefined,
      children: [],
      internal: {
        type: `Page`,
        contentDigest: createContentDigest(data),
      },
    });
  }
};

const dbFileName = `${__dirname}/../movielog-new/db/movie_db.sqlite3`;

const openDb = async () => {
  return open({
    filename: dbFileName,
    driver: sqlite3.Database,
  });
};

config.sourceNodes = async ({ actions, createContentDigest }) => {
  const { createNode } = actions;

  const db = await openDb();

  const watchlistTitles = await db.all(`
    SELECT
    movie_imdb_id as imdbId
      , title
      , year
      , GROUP_CONCAT(director_imdb_id) as directorImdbIdsConcat
      , GROUP_CONCAT(performer_imdb_id) as performerImdbIdsConcat
      , GROUP_CONCAT(writer_imdb_id) as writerImdbIdsConcat
      , GROUP_CONCAT(collection_name, '|') AS collectionNamesConcat
    FROM watchlist_titles
    LEFT JOIN movies ON imdbId = movies.imdb_id
    LEFT JOIN people AS directors ON director_imdb_id = directors.imdb_id
    LEFT JOIN people AS performers ON performer_imdb_id = performers.imdb_id
    LEFT JOIN people AS writers ON writer_imdb_id = writers.imdb_id
    GROUP BY
        (imdbId)
    ORDER BY
        year;
`);

  watchlistTitles.forEach((watchlistTitle) => {
    const data = { ...watchlistTitle };
    if (!data.directorImdbIdsConcat) {
      data.directorImdbIds = [];
    } else {
      data.directorImdbIds = data.directorImdbIdsConcat.split(",");
    }
    delete data.directorImdbIdsConcat;

    if (!data.performerImdbIdsConcat) {
      data.performerImdbIds = [];
    } else {
      data.performerImdbIds = data.performerImdbIdsConcat.split(",");
    }
    delete data.performerImdbIdsConcat;

    if (!data.writerImdbIdsConcat) {
      data.writerImdbIds = [];
    } else {
      data.writerImdbIds = data.writerImdbIdsConcat.split(",");
    }
    delete data.writerImdbIdsConcat;

    if (!data.collectionNamesConcat) {
      data.collectionIds = [];
    } else {
      data.collectionIds = data.collectionNamesConcat.split(",");
    }
    delete data.collectionNamesConcat;

    createNode({
      ...data,
      // Required fields.
      id: `watchlistTitle-${data.imdbId}`,
      parent: undefined,
      children: [],
      internal: {
        type: `WatchlistTitle`,
        contentDigest: createContentDigest(data),
      },
    });
  });

  const directorResults = await db.all(`
    SELECT
        people.imdb_id AS imdbId
      , people.full_name as fullName
      , slug
      , GROUP_CONCAT(DISTINCT watchlist_titles.movie_imdb_id) AS watchlistTitleImdbIdsConcat
    FROM (
          SELECT
              imdb_id
            , year
            , title
            , original_title
            , runtime_minutes
          FROM viewings
          LEFT JOIN movies ON movie_imdb_id = imdb_id
          UNION
          SELECT
              imdb_id
            , year
            , title
            , original_title
            , runtime_minutes
          FROM watchlist_titles
          LEFT JOIN movies ON movie_imdb_id = imdb_id
        ) AS joined
    INNER JOIN directing_credits ON joined.imdb_id = directing_credits.movie_imdb_id
    INNER JOIN people ON person_imdb_id = people.imdb_id
    LEFT JOIN watchlist_titles ON watchlist_titles.director_imdb_id = people.imdb_id
    GROUP BY
      people.imdb_id;
  `);

  directorResults.forEach((directorResult) => {
    const data = { ...directorResult };
    if (!data.watchlistTitleImdbIdsConcat) {
      data.watchlistTitleImdbIds = [];
    } else {
      data.watchlistTitleImdbIds = data.watchlistTitleImdbIdsConcat.split(",");
    }
    delete data.watchlistTitleImdbIdsConcat;
    createNode({
      ...data,
      // Required fields.
      id: `director-${data.imdbId}`,
      parent: undefined,
      children: [],
      internal: {
        type: `Director`,
        contentDigest: createContentDigest(data),
      },
    });
  });

  const performerResults = await db.all(`
    SELECT
      people.imdb_id AS imdbId
    , people.full_name AS fullName
    , slug
    , GROUP_CONCAT(DISTINCT watchlist_titles.movie_imdb_id) AS watchlistTitleImdbIdsConcat
    FROM people
    JOIN watchlist_titles ON imdb_id = watchlist_titles.performer_imdb_id
    GROUP BY
      people.imdb_id;
  `);

  performerResults.forEach((performerResult) => {
    const data = { ...performerResult };
    if (!data.watchlistTitleImdbIdsConcat) {
      data.watchlistTitleImdbIds = [];
    } else {
      data.watchlistTitleImdbIds = data.watchlistTitleImdbIdsConcat.split(",");
    }
    delete data.watchlistTitleImdbIdsConcat;
    createNode({
      ...data,
      // Required fields.
      id: `performer-${data.imdbId}`,
      parent: undefined,
      children: [],
      internal: {
        type: `Performer`,
        contentDigest: createContentDigest(data),
      },
    });
  });

  const writerResults = await db.all(`
    SELECT
        people.imdb_id AS imdbId
      , people.full_name as fullName
      , slug
      , GROUP_CONCAT(DISTINCT watchlist_titles.movie_imdb_id) AS watchlistTitleImdbIdsConcat
    FROM people
    JOIN watchlist_titles ON imdb_id = watchlist_titles.writer_imdb_id
    GROUP BY
      people.imdb_id;
`);

  writerResults.forEach((writerResult) => {
    const data = { ...writerResult };
    if (!data.watchlistTitleImdbIdsConcat) {
      data.watchlistTitleImdbIds = [];
    } else {
      data.watchlistTitleImdbIds = data.watchlistTitleImdbIdsConcat.split(",");
    }
    delete data.watchlistTitleImdbIdsConcat;
    createNode({
      ...data,
      // Required fields.
      id: `writer-${data.imdbId}`,
      parent: undefined,
      children: [],
      internal: {
        type: `Writer`,
        contentDigest: createContentDigest(data),
      },
    });
  });

  const viewingResults = await db.all(`
    SELECT
        movie_imdb_id AS imdbId
      , date
      , sequence
      , venue
    FROM viewings;
  `);

  viewingResults.forEach((viewingResult) => {
    const data = { ...viewingResult };

    createNode({
      ...data,
      // Required fields.
      id: `viewing-${data.imdbId}`,
      parent: undefined,
      children: [],
      internal: {
        type: `Viewing`,
        contentDigest: createContentDigest(data),
      },
    });
  });

  const collectionResults = await db.all(`
    SELECT
        collection_name as name
      , slug
      , group_concat(movie_imdb_id) AS movieImdbIdsConcat
    FROM watchlist_titles
    WHERE collection_name IS NOT NULL
    GROUP BY
      collection_name
  `);

  collectionResults.forEach((collectionResult) => {
    const data = { ...collectionResult };

    if (!data.movieImdbIdsConcat) {
      data.movieImdbIds = [];
    } else {
      data.movieImdbIds = data.movieImdbIdsConcat.split(",");
    }
    delete data.movieImdbIdsConcat;

    createNode({
      ...data,
      // Required fields.
      id: `collection-${data.slug}`,
      parent: undefined,
      children: [],
      internal: {
        type: `Collection`,
        contentDigest: createContentDigest(data),
      },
    });
  });

  const movieResults = await db.all(`
    SELECT
      imdb_id AS imdbId
    , year
    , title
    , original_title AS originalTitle
    , runtime_minutes AS runtimeMinutes
    , GROUP_CONCAT(DISTINCT directing_credits.person_imdb_id) AS directorImdbIdsConcat
    FROM (
          SELECT
            imdb_id
          , year
          , title
          , original_title
          , runtime_minutes
          FROM viewings
          LEFT JOIN movies ON movie_imdb_id = imdb_id
          UNION
          SELECT
            imdb_id
          , year
          , title
          , original_title
          , runtime_minutes
          FROM watchlist_titles
          LEFT JOIN movies ON movie_imdb_id = imdb_id
        ) AS joined
    LEFT JOIN directing_credits ON imdbId = directing_credits.movie_imdb_id
    GROUP BY
      imdbId;
  `);

  movieResults.forEach((movieResult) => {
    const data = { ...movieResult };
    if (!data.directorImdbIdsConcat) {
      data.directorImdbIds = [];
    } else {
      data.directorImdbIds = data.directorImdbIdsConcat.split(",");
    }
    delete data.directorImdbIdsConcat;

    const titleLower = data.title.toLowerCase();
    const words = titleLower.split(" ");
    const articles = ["a", "an", "the"];

    if (words.length > 1 && articles.includes(words[0])) {
      data.sortTitle = words.splice(1).join(" ");
    } else {
      data.sortTitle = titleLower;
    }

    createNode({
      ...data,
      // Required fields.
      id: `movie-${data.imdbId}`,
      parent: undefined,
      children: [],
      internal: {
        type: `Movie`,
        contentDigest: createContentDigest(data),
      },
    });
  });
};

module.exports = config;
