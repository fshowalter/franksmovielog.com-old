from typing import Any, Dict, List, Set

from movie_db import _db


class Result(object):
    def __init__(self, row: Dict[str, str]) -> None:
        self.id: str = row['id']
        self.title: str = row['title']
        self.directors: Set[str] = set()
        self.principals: Set[str] = set()


def search(query: str) -> List[Result]:
    with _db.connect() as connection:
        search_results = _fetch_results(connection, query)
        _append_directors(connection, search_results)
        _append_principals(connection, search_results)

    return search_results


def _fetch_results(connection: _db.Connection, query: str) -> List[Result]:
    cursor = connection.cursor()
    rows = cursor.execute(query).fetchall()

    search_results: List[Result] = []

    for row in rows:
        search_result = Result(row)
        search_results.append(search_result)

    return search_results


def _append_directors(connection: _db.Connection, search_results: List[Result]) -> None:
    cursor = connection.cursor()
    rows = cursor.execute(
        """
        SELECT movies.id, full_name, sequence FROM movies INNER JOIN directing_credits
        ON movies.id = directing_credits.movie_id INNER JOIN people
        ON people.id = directing_credits.person_id
        WHERE movies.id IN ({0}) ORDER BY sequence;
        """.format(_format_title_ids(search_results)),  # noqa: S608
    ).fetchall()

    results_hash = _hash_rows_by_title_id(rows)

    for search_result in search_results:
        search_result.directors.update(results_hash[search_result.id])


def _append_principals(connection: _db.Connection, search_results: List[Result]) -> None:
    cursor = connection.cursor()
    rows = cursor.execute(
        """
        SELECT movies.id, full_name, sequence FROM movies INNER JOIN principals
        ON movies.id = principals.movie_id INNER JOIN people
        ON people.id = principals.person_id
        WHERE movies.id IN ({0}) ORDER BY sequence;
        """.format(_format_title_ids(search_results)),  # noqa: S608
    ).fetchall()

    results_hash = _hash_rows_by_title_id(rows)

    for search_result in search_results:
        search_result.principals.update(results_hash[search_result.id])


def _hash_rows_by_title_id(rows: List[Any]) -> Dict[str, List[str]]:
    results_hash: Dict[str, List[str]] = {}

    for row in rows:
        title_id = row['movies.id']
        if results_hash[title_id] is None:
            results_hash[title_id] = []
        results_hash[title_id].append(row['full_name'])

    return results_hash


def _format_title_ids(movies: List[Result]) -> str:
    return ','.join('"{0}"'.format(movie.id) for movie in movies)
