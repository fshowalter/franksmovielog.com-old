#!/Users/fshowalt/workspace/frankshowalter/.venv/bin/python3

import html
from typing import Any, Callable, List, Tuple

from loguru import logger
from prompt_toolkit import prompt
from prompt_toolkit.formatted_text import HTML

from movie_db.cli.radio_list import radio_list
from movie_db.queries.search_directors_by_name import search_directors_by_name
from movie_db.queries.search_people import PersonSearchResult
from movie_db.queries.search_performers_by_name import search_performers_by_name
from movie_db.queries.search_writers_by_name import search_writers_by_name
from movie_db.update import update
from movie_db.watchlist.add_director import add_director
from movie_db.watchlist.add_performer import add_performer
from movie_db.watchlist.add_writer import add_writer
from movie_db.watchlist.watchlist_item import WatchlistItem


def add_director_to_watchlist() -> None:
    _add_person_to_watchlist(
        person_type='Director',
        search_func=search_directors_by_name,
        add_func=add_director,
    )


def add_writer_to_watchlist() -> None:
    _add_person_to_watchlist(
        person_type='Writer',
        search_func=search_writers_by_name,
        add_func=add_writer,
    )


def add_performer_to_watchlist() -> None:
    _add_person_to_watchlist(
        person_type='Performer',
        search_func=search_performers_by_name,
        add_func=add_performer,
    )


def add_to_watchlist() -> None:
    option_function = None

    while option_function is None:
        option_function = radio_list(
            title='Add to watchlist:',
            options=[
                (add_performer_to_watchlist, 'Performer'),
                (add_director_to_watchlist, 'Director'),
                (add_writer_to_watchlist, 'Writer'),
                (None, 'Go back'),
            ])

        if option_function:
            option_function()

    main()


@logger.catch
def main() -> Any:
    option_function = radio_list(
        title='Movie DB options:',
        options=[
            (add_to_watchlist, 'Add to Watchlist'),
            (update, 'Update IMDb data'),
            (None, 'Exit'),
        ])

    if option_function:
        option_function()


def _person_search_results_to_options(
    search_results: List[PersonSearchResult],
) -> List[Tuple[PersonSearchResult, HTML]]:
    options: List[Tuple[PersonSearchResult, HTML]] = []

    for search_result in search_results:
        option = HTML('<b><white>{0}</white></b> ({1})'.format(
            search_result.name,
            ', '.join(html.escape(title) for title in search_result.known_for_titles),
        ))
        options.append((search_result, option))

    return options


def _add_person_to_watchlist(
    person_type: str,
    search_func: Callable[[str], List[PersonSearchResult]],
    add_func: Callable[[WatchlistItem], None],
) -> None:
    person = None

    while person is None:
        query = prompt("{0}'s name: ".format(person_type))

        search_results = search_func(query)

        person = radio_list(
            title='Results for "{0}":'.format(query),
            options=[
                (None, 'Search again'),
                *_person_search_results_to_options(search_results),
            ],
        )

    add_func(WatchlistItem(id=person.id, name=person.name))


main()
