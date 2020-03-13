from typing import List, Set

from movie_db import _db, _movie_searcher, _person_searcher

PersonSearchResult = _person_searcher.Result
MovieSearchResult = _movie_searcher.Result


def get_title_ids() -> Set[str]:
    with _db.connect() as connection:
        cursor = connection.cursor()
        cursor.row_factory = lambda cursor, row: row[0]
        return set(cursor.execute('select id from movies').fetchall())


def search_directors_by_name(name_query: str, limit: int = 10) -> List[_person_searcher.Result]:
    full_query = """
        SELECT distinct(people.id), full_name, known_for_title_ids FROM people
        INNER JOIN directing_credits ON people.id = directing_credits.person_id
        WHERE full_name LIKE "%{0}%" ORDER BY full_name LIMIT {1};
        """.format(name_query, limit)  # noqa: S608

    return _person_searcher.search(full_query)


def search_movies_by_title(title_query: str) -> List[_movie_searcher.Result]:
    full_query = """
        SELECT id, title, year FROM movies WHERE title LIKE "%{0}%" ORDER BY title;
        """.format(title_query)  # noqa: S608
    return _movie_searcher.search(full_query)


def search_performers_by_name(name_query: str, limit: int = 10) -> List[_person_searcher.Result]:
    full_query = """
        SELECT distinct(people.id), full_name, known_for_title_ids FROM people
        WHERE full_name LIKE "%{0}%" ORDER BY full_name LIMIT {1};
        """.format(name_query, limit)  # noqa: S608

    return _person_searcher.search(full_query)


def search_writers_by_name(name_query: str, limit: int = 10) -> List[_person_searcher.Result]:
    full_query = """
        SELECT distinct(people.id), full_name, known_for_title_ids FROM people
        INNER JOIN writing_credits ON people.id = writing_credits.person_id
        WHERE full_name LIKE "%{0}%" ORDER BY full_name LIMIT {1};
        """.format(name_query, limit)  # noqa: S608

    return _person_searcher.search(full_query)
