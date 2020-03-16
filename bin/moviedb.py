#! /usr/bin/env python3

import html
from typing import Any, Callable, List, NewType, Optional, Sequence, Tuple, overload

from prompt_toolkit import key_binding, prompt
from prompt_toolkit.application import Application
from prompt_toolkit.formatted_text import HTML
from prompt_toolkit.layout import Layout
from prompt_toolkit.layout.containers import HSplit
from prompt_toolkit.shortcuts import confirm
from prompt_toolkit.widgets import Label, RadioList
from typing_extensions import Protocol

from movie_db import imdb_files, queries, watchlist
from movie_db.logger import logger

OptionalCallableType = Optional[Callable[[], None]]
CallableOptionType = Tuple[OptionalCallableType, HTML]
CallableOptions = NewType('CallableOptions', List[CallableOptionType])


def add_to_watchlist() -> None:
    options = CallableOptions([
        (lambda: add_person_to_watchlist(
            person_type='director',
            search_func=queries.search_directors_by_name,
            add_func=watchlist.add_person,
        ),
            HTML('<cyan>Director</cyan>'),
        ),
        (lambda: add_person_to_watchlist(
            person_type='performer',
            search_func=queries.search_performers_by_name,
            add_func=watchlist.add_person,
        ),
            HTML('<cyan>Performer</cyan>'),
        ),
        (lambda: add_person_to_watchlist(
            person_type='writer',
            search_func=queries.search_writers_by_name,
            add_func=watchlist.add_person,
        ),
            HTML('<cyan>Writer</cyan>'),
        ),
        (None, 'Go back'),
    ])

    option_function = radio_list(
        title='Add to watchlist:',
        options=options,
    )

    if option_function:
        option_function()

    main()


def update_imdb_data() -> None:  # noqa: WPS430
    if confirm('Download and update IMDb core files?'):
        imdb_files.orchestrate_update()

    main()


PersonSearchResults = Sequence[queries.PersonSearchResult]
PersonSearchResultOptionType = Tuple[Optional[queries.PersonSearchResult], HTML]
PersonSearchOptions = NewType('PersonSearchOptions', List[PersonSearchResultOptionType])


def build_options_for_person_search_results(
    search_results: PersonSearchResults,
) -> PersonSearchOptions:
    options = PersonSearchOptions([
        (None, 'Search again'),
    ])

    for search_result in search_results:
        option = HTML('<cyan>{0}</cyan> ({1})'.format(
            search_result.name,
            ', '.join(html.escape(title) for title in search_result.known_for_titles),
        ))
        options.append((search_result, option))

    return options


def select_person(
    person_type: str,
    search_func: Callable[[str], PersonSearchResults],
) -> queries.PersonSearchResult:

    person = None

    while person is None:
        query = prompt(f"{person_type.capitalize()}'s name: ")

        search_results = search_func(query)

        person = radio_list(
            title=HTML(f'Results for "<cyan>{query}</cyan>":'),
            options=build_options_for_person_search_results(search_results),
        )

    return person


class AddPersonToWatchListFunc(Protocol):
    def __call__(self, person_type: watchlist.PersonTypes, imdb_id: str, name: str) -> None:
        ...  # noqa: WPS428


def add_person_to_watchlist(
    person_type: watchlist.PersonTypes,
    search_func: Callable[[str], PersonSearchResults],
    add_func: AddPersonToWatchListFunc,
) -> None:

    person = select_person(person_type=person_type, search_func=search_func)
    add_func(person_type=person_type, imdb_id=person.id, name=person.name)


@overload
def radio_list(
    title: str, options: PersonSearchOptions,
) -> Optional[queries.PersonSearchResult]:
    ...  # noqa: WPS428


@overload
def radio_list(title: str, options: CallableOptions) -> OptionalCallableType:
    ...  # noqa: WPS428


def radio_list(title: str, options: Sequence[Any]) -> Any:
    control = RadioList(options)

    # Add exit key binding.
    bindings = key_binding.KeyBindings()

    @bindings.add('c-d')  # type: ignore  # noqa WPS430
    def exit_(event: key_binding.key_processor.KeyPressEvent) -> None:
        """
        Pressing Ctrl-d will exit the user interface.
        """
        event.app.exit()

    @bindings.add('enter', eager=True)  # type: ignore  # noqa: WPS430
    def exit_with_value(event: key_binding.key_processor.KeyPressEvent) -> None:
        """
        Pressing Ctrl-a will exit the user interface returning the selected value.
        """
        control._handle_enter()  # noqa: WPS437
        event.app.exit(result=control.current_value)

    application = Application(
        layout=Layout(HSplit([Label(title), control])),
        key_bindings=key_binding.merge_key_bindings(
            [key_binding.defaults.load_key_bindings(), bindings],
        ),
        mouse_support=True,
        full_screen=False,
    )

    return application.run()


@logger.catch
def main() -> Any:
    options = CallableOptions([
        (add_to_watchlist, HTML('<cyan>Add to Watchlist</cyan>')),
        (update_imdb_data, HTML('<cyan>Update IMDb data</cyan>')),
        (None, 'Exit'),
    ])

    option_function = radio_list(
        title='Movie DB options:',
        options=options,
    )

    if option_function:
        option_function()


if __name__ == '__main__':
    main()
