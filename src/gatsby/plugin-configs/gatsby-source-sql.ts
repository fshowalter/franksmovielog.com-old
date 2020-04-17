import * as Knex from 'knex';

const dbFileName = `${__dirname}/../../../../movielog-new/db/movie_db.sqlite3`;

export default [
  {
    // Querying to a SQLite database
    resolve: `gatsby-source-sql`,
    options: {
      typeName: "Director",
      // This is the field under which the data will be accessible in a future version
      fieldName: "unused",
      dbEngine: {
        client: "sqlite3",
        connection: {
          filename: dbFileName,
        },
        useNullAsDefault: true,
      },
      queryChain: function queryChain(x: Knex) {
        return x
          .select("viewings.movie_imdb_id", "full_name")
          .from("viewings")
          .leftJoin(
            "directing_credits",
            "directing_credits.movie_imdb_id",
            "viewings.movie_imdb_id"
          )
          .leftJoin("people", "person_imdb_id", "imdb_id")
          .groupBy("viewings.movie_imdb_id");
      },
    },
  },
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
          filename: dbFileName,
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
  {
    // Querying to a SQLite database
    resolve: `gatsby-source-sql`,
    options: {
      typeName: "Movie",
      // This is the field under which the data will be accessible in a future version
      fieldName: "unused",
      dbEngine: {
        client: "sqlite3",
        connection: {
          filename: dbFileName,
        },
        useNullAsDefault: true,
      },
      queryChain: function queryChain(x: Knex) {
        return x
          .select(
            "imdb_id",
            "year",
            "title",
            "original_title",
            "runtime_minutes"
          )
          .from("viewings")
          .leftJoin("movies", "movie_imdb_id", "imdb_id")
          .groupBy("imdb_id");
      },
    },
  },
];
