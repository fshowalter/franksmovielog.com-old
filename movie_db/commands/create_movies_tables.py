# Responsible for creating the movies and aka_titles tables.


def create_movies_tables(db):
    """Responsible for creating the movies and aka_titles tables.

    Arguments:
        db {sqlite3.Connection} -- The database connection.
    """
    db.executescript(_movies_table_schema())
    db.executescript(_aka_titles_schema())


def _movies_table_schema():
    return """
    DROP TABLE IF EXISTS "movies";
    CREATE TABLE "movies" (
        "id" varchar(10) NOT NULL,
        "title" varchar(255) NOT NULL,
        "year" varchar(255) NOT NULL,
        "runtime_minutes" varchar(255));
    """


def _aka_titles_schema():
    return """
    DROP TABLE IF EXISTS "aka_titles";
    CREATE TABLE "aka_titles" (
        "id" varchar(10) NOT NULL,
        "aka_title" varchar(255) NOT NULL,
        CONSTRAINT fk_aka_titles_title FOREIGN KEY("id") REFERENCES "movies" ("id"));
    """
