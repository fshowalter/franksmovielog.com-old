import utils.formatter as formatter


def create_movie_tables(db):
    """Responsible for creating the movies and aka_titles tables.

    Arguments:
        db {sqlite3.Connection} -- The database connection.
    """
    print(formatter.h1(f"Creating {formatter.identifier('movie')} tables"))
    db.executescript(_create_movies_table())
    print(formatter.h2(f"Created movie tables"))

    print(formatter.h1(f"Creating {formatter.identifier('aka_titles')} tables"))
    db.executescript(_create_aka_titles_table())
    print(formatter.h2(f"Created aka_titles tables"))


def _create_movies_table():
    return """
    DROP TABLE IF EXISTS "movies";
    CREATE TABLE "movies" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "title" TEXT NOT NULL,
        "year" INT NOT NULL,
        "runtime_minutes" INT);
    """


def _create_aka_titles_table():
    return """
    DROP TABLE IF EXISTS "aka_titles";
    CREATE TABLE "aka_titles" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "movie_id" TEXT NOT NULL,
        "aka_title" TEXT NOT NULL,
        CONSTRAINT fk_aka_titles_movie_id FOREIGN KEY("movie_id") REFERENCES "movies" ("id"));
    """
