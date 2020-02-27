from commands.create_movie_tables import create_movie_tables
from utils.spinner import start_spinner, stop_spinner
import utils.formatter as formatter


def reload_movies(db, titles):
    create_movie_tables(db=db)
    _insert_movies(db=db, titles=titles)


def _insert_movies(db, titles):
    print(formatter.h1(f"Inserting {formatter.identifier('titles')}"))
    spinner = start_spinner('Loading titles...')
    _insert_titles(db=db, titles=titles)
    stop_spinner(spinner, f'Inserted {len(titles):,} titles')

    spinner = start_spinner('Inserting aka titles...')
    _insert_aka_titles(db=db, titles=titles)
    aka_titles_count = 0

    for title in titles.values():
        if title.aka_titles:
            aka_titles_count += len(title.aka_titles)

    stop_spinner(spinner, f'Inserted {aka_titles_count:,} aka titles')


def _insert_titles(db, titles):
    def titles_to_tuple():
        for (id, movie) in titles.items():
            yield (id, movie.title, movie.year, movie.runtime_minutes)

    db.executemany("""
        INSERT INTO movies(id, title, year, runtime_minutes)
        VALUES(?, ?, ?, ?)""", titles_to_tuple())


def _insert_aka_titles(db, titles):
    def aka_titles_to_tuple():
        for (id, title) in titles.items():
            if 'aka_titles' not in title:
                continue
            for aka_title in title['aka_titles']:
                yield(id, aka_title)

    db.executemany("""
        INSERT INTO aka_titles (movie_id, aka_title)
        VALUES(?, ?)""", aka_titles_to_tuple())
