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

from movie_db.cli import main
from movie_db import imdb_files, queries, watchlist
from movie_db.logger import logger

OptionalCallableType = Optional[Callable[[], None]]
CallableOptionType = Tuple[OptionalCallableType, HTML]
CallableOptions = NewType('CallableOptions', List[CallableOptionType])


def add_to_watchlist() -> None:
    options = CallableOptions([
        (
            add_director_to_watchlist,
            HTML('<cyan>Director</cyan>'),
        ),
        (
            add_performer_to_watchlist,
            HTML('<cyan>Performer</cyan>'),
        ),
        (
            add_writer_to_watchlist,
            HTML('<cyan>Writer</cyan>'),
        ),
        (
            collection_menu,
            HTML('<cyan>Collection</cyan>'),
        ),
        (None, 'Go back'),
    ])

    option_function = radio_list(
        title='Add to Watchlist:',
        options=options,
    )

    if option_function:
        option_function()

    main()


def update_imdb_data() -> None:  # noqa: WPS430
    if confirm('Download and update IMDb core files?'):
        imdb_files.orchestrate_update()

    main()


CollectionOptionType = Tuple[Optional[watchlist.Collection], HTML]
CollectionOptions = NewType('CollectionOptions', List[CollectionOptionType])

PersonSearchResults = Sequence[queries.PersonSearchResult]
PersonSearchResultOptionType = Tuple[Optional[queries.PersonSearchResult], HTML]
PersonSearchOptions = NewType('PersonSearchOptions', List[PersonSearchResultOptionType])

MovieSearchResultOptionType = Tuple[Optional[queries.MovieSearchResult], str]
MovieSearchOptions = NewType('MovieSearchOptions', List[MovieSearchResultOptionType])


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
        query = prompt(f"{person_type}'s name: ")

        search_results = search_func(query)

        person = radio_list(
            title=HTML(f'Results for "<cyan>{query}</cyan>":'),
            options=build_options_for_person_search_results(search_results),
        )

    return person


def add_director_to_watchlist() -> None:
    person = select_person('Director', queries.search_directors_by_name)
    watchlist.add_director(person.imdb_id, person.name)


def add_performer_to_watchlist() -> None:
    person = select_person('Performer', queries.search_performers_by_name)
    watchlist.add_performer(person.imdb_id, person.name)


def add_writer_to_watchlist() -> None:
    person = select_person('Writer', queries.search_writers_by_name)
    watchlist.add_writer(person.imdb_id, person.name)


def new_collection() -> None:
    name = prompt('Collection name: ')
    if confirm(f'{name}?'):
        watchlist.add_collection(name)


def build_options_for_movie_search_results(
    search_results: Sequence[queries.MovieSearchResult],
) -> MovieSearchOptions:
    options = MovieSearchOptions([
        (None, 'Search again'),
    ])

    for search_result in search_results:
        option = HTML('<cyan>{0} ({1})</cyan> ({2})'.format(
            search_result.title,
            search_result.year,
            ', '.join(html.escape(title) for title in search_result.principals),
        ))
        options.append((search_result, option))

    return options


def select_movie_for_collection(collection: watchlist.Collection) -> queries.MovieSearchResult:
    formatted_titles = [f'\u00B7 {title.title} ({title.year}) \n' for title in collection.titles]

    prompt_text = f"Titles:\n {''.join(formatted_titles)} \nNew Title: "
    movie = None

    while movie is None:
        query = prompt(prompt_text)

        search_results = queries.search_movies_by_title(query)

        movie = radio_list(
            title=HTML(f'Results for "<cyan>{query}</cyan>":'),
            options=build_options_for_movie_search_results(search_results),
        )

    return movie


def build_add_to_collection_options() -> CollectionOptions:
    options = CollectionOptions([
        (None, 'Go back'),
    ])

    for collection in watchlist.Collection.unfrozen_items():
        option = HTML(f'<cyan>{collection.name}</cyan>')
        options.append((collection, option))

    return options


def add_to_collection() -> None:
    collection = radio_list(
        title=HTML('Add to Collection:'),
        options=build_add_to_collection_options(),
    )

    if collection:
        pass


def collection_menu() -> None:
    options = CallableOptions([
        (new_collection, HTML('<cyan>New Collection</cyan>')),
        (add_to_collection, HTML('<cyan>Add to Collection</cyan>')),
        (None, 'Go Back'),
    ])

    option_function = radio_list(
        title='Collection:',
        options=options,
    )

    if option_function:
        option_function()


@overload
def radio_list(
    title: str, options: CollectionOptions,
) -> Optional[watchlist.Collection]:
    ...  # noqa: WPS428


@overload
def radio_list(
    title: str, options: MovieSearchOptions,
) -> Optional[queries.MovieSearchResult]:
    ...  # noqa: WPS428


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
def main2() -> Any:
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
    main.prompt()
