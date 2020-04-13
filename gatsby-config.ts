import * as Knex from "knex";

export const siteMetadata = {
  title: `Frank's Movie Log`,
  siteUrl: `https://www.franksmovielog.com`,
  description: `Quality reviews of films of questionable quality.`,
};

export const plugins = [
  {
    resolve: `gatsby-plugin-graphql-codegen`,
    options: {
      documentPaths: [
        "./src/**/*.{ts,tsx}",
        "./node_modules/gatsby-*/**/*.js",
        "./gatsby-node.ts",
      ],
    },
  },
  {
    resolve: `gatsby-plugin-sharp`,
    options: {
      toFormat: "JPG",
      stripMetadata: true,
      defaultQuality: 75,
    },
  },
  `gatsby-transformer-sharp`,
  `gatsby-transformer-remark`,
  `gatsby-plugin-typescript`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: "backdrop",
      path: `${__dirname}/src/assets/backdrops/`,
    },
  },
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `review`,
      path: `${__dirname}/../movielog-new/reviews/`,
    },
  },
  `gatsby-plugin-react-helmet`,
  `gatsby-plugin-emotion`,
  {
    // Querying to a SQLite database
    resolve: `gatsby-source-sql`,
    options: {
      typeName: "WatchlistTitle",
      // This is the field under which the data will be accessible in a future version
      fieldName: "unused",
      dbEngine: {
        client: "sqlite3",
        connection: {
          filename: `${__dirname}/../movielog-new/db/movie_db.sqlite3`,
        },
        useNullAsDefault: true,
      },
      queryChain: function queryChain(x: Knex) {
        return x
          .select(
            "year",
            "title",
            "movie_imdb_id",
            x.raw("GROUP_CONCAT(directors.full_name, '|') AS director_names"),
            x.raw("GROUP_CONCAT(director_imdb_id, ',') AS director_imdb_ids"),
            x.raw("GROUP_CONCAT(performers.full_name, '|') AS performer_names"),
            x.raw("GROUP_CONCAT(performer_imdb_id, ',') AS performer_imdb_ids"),
            x.raw("GROUP_CONCAT(writers.full_name, '|') AS writer_names"),
            x.raw("GROUP_CONCAT(writer_imdb_id, ',') AS writer_imdb_ids"),
            x.raw("GROUP_CONCAT(collection_name, '|') AS collection_names")
          )
          .from("watchlist_titles")
          .leftJoin("movies", "movie_imdb_id", "movies.imdb_id")
          .leftJoin(
            "people AS directors",
            "director_imdb_id",
            "directors.imdb_id"
          )
          .leftJoin(
            "people AS performers",
            "performer_imdb_id",
            "performers.imdb_id"
          )
          .leftJoin("people AS writers", "writer_imdb_id", "writers.imdb_id")
          .groupBy("movie_imdb_id");
      },
    },
  },
  "gatsby-transformer-yaml",
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `viewing`,
      path: `${__dirname}/../movielog-new/viewings`,
    },
  },
];