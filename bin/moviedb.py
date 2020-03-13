#!/Users/fshowalt/workspace/frankshowalter/.venv/bin/python3

import html
from typing import Any, Callable, List, Sequence, Tuple

from prompt_toolkit import prompt
from prompt_toolkit.formatted_text import HTML

from movie_db import cli, imdb_files, queries, watchlist
from movie_db.logger import logger


def add_director_to_watchlist() -> None:
    _add_person_to_watchlist(
        person_type='Director',
        search_func=queries.search_directors_by_name,
        add_func=watchlist.add_director,
    )


def add_writer_to_watchlist() -> None:
    _add_person_to_watchlist(
        person_type='Writer',
        search_func=queries.search_writers_by_name,
        add_func=watchlist.add_writer,
    )


def add_performer_to_watchlist() -> None:
    _add_person_to_watchlist(
        person_type='Performer',
        search_func=queries.search_performers_by_name,
        add_func=watchlist.add_performer,
    )


def add_to_watchlist() -> None:
    option_function = None

    while option_function is None:
        option_function = cli.radio_list(
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
    options: Sequence[cli.OptionType] = [
        (add_to_watchlist, 'Add to Watchlist'),
        (imdb_files.download_and_update, 'Update IMDb data'),
        (None, 'Exit'),
    ]

    option_function = cli.radio_list(
        title='Movie DB options:',
        options=options,
    )

    if option_function:
        option_function()


def _person_search_results_to_options(
    search_results: List[queries.PersonSearchResult],
) -> List[Tuple[queries.PersonSearchResult, HTML]]:
    options: List[Tuple[queries.PersonSearchResult, HTML]] = []

    for search_result in search_results:
        option = HTML('<b><white>{0}</white></b> ({1})'.format(
            search_result.name,
            ', '.join(html.escape(title) for title in search_result.known_for_titles),
        ))
        options.append((search_result, option))

    return options


def _add_person_to_watchlist(
    person_type: str,
    search_func: Callable[[str], List[queries.PersonSearchResult]],
    add_func: Callable[[watchlist.Item], None],
) -> None:
    person = None

    while person is None:
        query = prompt("{0}'s name: ".format(person_type))

        search_results = search_func(query)

        person = cli.radio_list(
            title='Results for "{0}":'.format(query),
            options=[
                (None, 'Search again'),
                *_person_search_results_to_options(search_results),
            ],
        )

    add_func(watchlist.Item(imdb_id=person.id, name=person.name))


main()
