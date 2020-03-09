from typing import List

from movie_db.queries.search_people import PersonSearchResult, search_people


def search_performers_by_name(name_query: str, limit: int = 10) -> List[PersonSearchResult]:
    full_query = """
        SELECT distinct(people.id), full_name, known_for_title_ids FROM people
        WHERE full_name LIKE '{0}%' ORDER BY full_name LIMIT {1};
        """.format(name_query, limit)  # noqa: S608

    return search_people(full_query)
