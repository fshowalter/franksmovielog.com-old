import * as Knex from 'knex';

const dbFileName = `${__dirname}/../../../../movielog-new/db/movie_db.sqlite3`;

const moviesQuery = (knex: Knex) => {
  return knex.union([
    knex
      .select("imdb_id", "year", "title", "original_title", "runtime_minutes")
      .from("viewings")
      .leftJoin("movies", "movie_imdb_id", "imdb_id"),
    knex
      .select("imdb_id", "year", "title", "original_title", "runtime_minutes")
      .from("watchlist_titles")
      .leftJoin("movies", "movie_imdb_id", "imdb_id"),
  ]);
};

export default [
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
        const query = x
          .select(
            "imdb_id as imdbId",
            "year",
            "title",
            "original_title as originalTitle",
            "runtime_minutes as runtimeMinutes",
            x.raw(
              "GROUP_CONCAT(distinct directing_credits.person_imdb_id) AS _directorImdbIdsConcat"
            )
          )
          .from(moviesQuery(x).as("joined"))
          .leftJoin(
            "directing_credits",
            "imdbId",
            "directing_credits.movie_imdb_id"
          )
          .groupBy("imdbId");

        console.log(query.toSQL());

        return query;
      },
    },
  },
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
        const query = x
          .select(
            "people.imdb_id as imdbId",
            "people.full_name",
            "slug",
            x.raw(
              "GROUP_CONCAT(distinct watchlist_titles.movie_imdb_id) as _watchlistTitleImdbIdsConcat"
            )
          )
          .from(moviesQuery(x).as("joined"))
          .join(
            "directing_credits",
            "joined.imdb_id",
            "directing_credits.movie_imdb_id"
          )
          .join("people", "person_imdb_id", "people.imdb_id")
          .leftJoin(
            "watchlist_titles",
            "watchlist_titles.director_imdb_id",
            "people.imdb_id"
          )
          .groupBy("people.imdb_id");

        console.log(query.toSQL());

        return query;
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
            x.raw(
              "GROUP_CONCAT(director_imdb_id, ',') AS _directorImdbIdsConcat"
            ),
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
];
