from utils.spinner import start_spinner, stop_spinner


def create_cast_and_crew_tables(db):
    """Responsible for creating the people and credits tables.

    Arguments:
        db {sqlite3.Connection} - - The database connection.
    """
    def _create_tables():
        spinner = start_spinner('Creating cast and crew tables...')
        db.executescript(_create_people_table())
        db.executescript(_create_performance_credits_table())
        db.executescript(_create_principals_table())
        db.executescript(_create_direction_credits())
        db.executescript(_create_writing_credits())
        stop_spinner(spinner, 'Created cast and crew tables.')


def _create_people_table():
    return """
      DROP TABLE IF EXISTS "people";
      CREATE TABLE "people" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "full_name" varchar(255) NOT NULL,
        "last_name" varchar(255),
        "first_name" varchar(255));
    """


def _create_principals_table():
    return """
      DROP TABLE IF EXISTS "principals";
      CREATE TABLE "principals" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "movie_id" TEXT NOT NULL,
        "person_id" TEXT NOT NULL,
        "sequence" INTEGER NOT NULL,
        "category" TEXT,
        "job" TEXT,
        "characters" TEXT,
        CONSTRAINT fk_principals_movie_id FOREIGN KEY("movie_id") REFERENCES "movies" ("id"),
        CONSTRAINT fk_principals_person_id FOREIGN KEY("person_id") REFERENCES "people" ("id"));
    """


def _create_performance_credits_table():
    return """
      DROP TABLE IF EXISTS "performance_credits";
      CREATE TABLE "performance_credits" (
          "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          "person_id" TEXt NOT NULL,
          "movie_id" TEXT NOT NULL,
          "role" TEXT,
          "notes" TEXT,
          "position_in_credits" INT,
          CONSTRAINT fk_performance_credits_person_id FOREIGN KEY("person_id") REFERENCES "people" ("id"),
          CONSTRAINT fk_performance_credits_title FOREIGN KEY("movie_id") REFERENCES "movies" ("id"));
    """


def _create_direction_credits():
    return """
      DROP TABLE IF EXISTS "direction_credits";
      CREATE TABLE "direction_credits" (
          "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          "person_id" TEXT NOT NULL,
          "movie_id" TEXT NOT NULL,
          "notes" TEXT,
          CONSTRAINT fk_direction_credits_person_id FOREIGN KEY("person_id") REFERENCES "people" ("id"),
          CONSTRAINT fk_direction_credits_movie_id FOREIGN KEY("movie_id") REFERENCES "movies" ("id"));
    """


def _create_writing_credits():
    return """
      DROP TABLE IF EXISTS "writing_credits";
      CREATE TABLE "writing_credits" (
          "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          "person_id" TEXT NOT NULL,
          "movie_id" TEXT NOT NULL,
          "notes" TEXT,
          "sequence" INTEGER,
          CONSTRAINT fk_writing_credits_person_Id FOREIGN KEY("person_Id") REFERENCES "people" ("id"),
          CONSTRAINT fk_writing_credits_movie_id FOREIGN KEY("movie_id") REFERENCES "movies" ("id"));
    """
