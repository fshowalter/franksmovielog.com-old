"""Responsible for updating the movie datastore.
"""
import os
import sqlite3
from commands.reload_movies import reload_movies
from download_data import download_data
from extract_titles import extract_titles
from extract_aka_titles import extract_aka_titles
from extract_names import extract_names
from extract_principals import extract_principals
from extract_crew import extract_crew


def update(movie_db_dir):
    """Responsible for updating the movie datastore.
    """
    data_path = download_data()
    titles = extract_titles(data_path=data_path)
    extract_aka_titles(titles=titles, data_path=data_path)
    names = extract_names(data_path=data_path)
    extract_principals(titles=titles, names=names, data_path=data_path)
    extract_crew(titles=titles, names=names, data_path=data_path)

    db = _init_db(movie_db_dir=movie_db_dir)
    reload_movies(db=db, titles=titles)


def _init_db(movie_db_dir):
    path = os.path.join(movie_db_dir, 'movie_db.sqlite3')
    return sqlite3.connect(path, isolation_level=None)


if __name__ == "__main__":
    update('movie_db_data')
