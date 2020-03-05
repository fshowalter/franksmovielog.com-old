from typing import Any, Dict, List, Set, Tuple

from movie_db.utils.db import Connection, db
from movie_db.utils.logger import logger


class SearchDirectorsResult(object):
    def __init__(self, row: Dict[str, str]) -> None:
        self.id = row['id']
        self.name = row['full_name']
        self.known_for_title_ids = row['known_for_title_ids'].split(',')
        self.known_for_titles: List[str] = []


@logger.catch
def search_directors(query: str, limit: int = 10) -> List[SearchDirectorsResult]:
    with db() as connection:
        search_results, title_ids = _fetch_results(connection, query, limit)
        titles = _resolve_known_for_title_ids(connection, title_ids)
        _expand_known_for_title_ids(search_results, titles)

    return search_results


def _expand_known_for_title_ids(
    search_results: List[SearchDirectorsResult],
    titles: Dict[str, str],
) -> None:
    for search_result in search_results:
        for title_id in search_result.known_for_title_ids:
            search_result.known_for_titles.append(titles[title_id])


def _fetch_results(
  connection: Connection,
  query: str,
  limit: int,
) -> Tuple[List[SearchDirectorsResult], Set[str]]:  # noqa: WPS221
    cursor = connection.cursor()
    rows = cursor.execute(
        """
        SELECT distinct(people.id), full_name, known_for_title_ids FROM people
        INNER JOIN directing_credits ON people.id = directing_credits.person_id
        WHERE full_name LIKE '%{0}%' LIMIT {1};
        """.format(query, limit),  # noqa: S608
    ).fetchall()

    return _parse_rows(rows)


def _parse_rows(rows: List[Any]) -> Tuple[List[SearchDirectorsResult], Set[str]]:
    search_results: List[SearchDirectorsResult] = []
    title_ids: Set[str] = set()

    for row in rows:
        search_result = SearchDirectorsResult(row)
        search_results.append(search_result)
        title_ids.update(search_result.known_for_title_ids)

    return (search_results, title_ids)


def _resolve_known_for_title_ids(connection: Connection, title_ids: Set[str]) -> Dict[str, str]:
    cursor = connection.cursor()
    movie_results = cursor.execute(
        """
        SELECT id, title FROM movies
        WHERE id IN ({0});
        """.format(_format_title_ids(title_ids)),  # noqa: S608
    ).fetchall()

    movies: Dict[str, str] = {}

    for row in movie_results:
        movies[row['id']] = row['title']

    return movies


def _format_title_ids(title_ids: Set[str]) -> str:
    return ','.join('"{0}"'.format(title_id) for title_id in title_ids)


if __name__ == '__main__':
    search_directors('john ford')
