from contextlib import contextmanager
from halo import Halo
from commands.bulk_insert import bulk_insert
from commands.create_movies_tables import create_movies_tables


def reload_movies(db, titles):
    with bulk_insert(db):
        create_movies_tables(db=db)
        _insert_movies(db=db, titles=titles)


if __name__ == "__main__":
    reload_movies()


def _insert_movies(db, titles):
    _insert_titles(db=db, titles=titles)
    _insert_aka_titles(db=db, titles=titles)


def _insert_titles(db, titles):
    def titles_to_tuple():
        for (id, title) in titles.items():
            yield (id, title['title'], title['year'], title['runtime_minutes'])

    with (_progress('inserting titles')):
        db.executemany("""
            INSERT INTO movies(id, title, year, runtime_minutes)
            VALUES(?, ?, ?, ?)""", titles_to_tuple())


@contextmanager
def _progress(title):
    spinner = Halo(text='{}...'.format(title), spinner='dots')
    try:
        spinner.start()
        yield
        spinner.succeed('Done {}!'.format(title))
    finally:
        pass


def _insert_aka_titles(db, titles):
    def aka_titles_to_tuple():
        try:
            for (id, title) in titles.items():
                if 'aka_titles' not in title:
                    continue
                for aka_title in title['aka_titles']:
                    yield(id, aka_title)
        except Exception:
            print(title)
            raise

    with (_progress('inserting aka titles')):
        db.executemany("""
            INSERT INTO aka_titles (id, aka_title)
            VALUES(?, ?)""", aka_titles_to_tuple())
