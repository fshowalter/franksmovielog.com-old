"""Responsible for updating the movie datastore.
"""
import os
import sqlite3
from commands.reload_movies import reload_movies
from commands.reload_cast_and_crew import reload_cast_and_crew
from download_data import download_data
from update_titles import update_titles
from extract_aka_titles import extract_aka_titles
from extract_names import extract_names
from extract_principals import extract_principals
from extract_crew import extract_crew
from commands.bulk_insert import bulk_insert
from ensure_download_directory import ensure_download_directory


def update(movie_db_dir: str):
    """Responsible for updating the movie datastore.
    """
    data_path = ensure_download_directory(movie_db_dir)
    update_titles(data_path=data_path)
#     extract_aka_titles(titles=titles, data_path=data_path)
#     cast_and_crew = extract_names(data_path=data_path)
#     extract_principals(titles=titles, names=cast_and_crew, data_path=data_path)
#     extract_crew(titles=titles, names=cast_and_crew, data_path=data_path)

#     db = _init_db(movie_db_dir=movie_db_dir)

#     with bulk_insert(db):
#         reload_movies(db=db, titles=titles)
#         reload_cast_and_crew(db=db, cast_and_crew=cast_and_crew, titles=titles)


def _init_db(movie_db_dir: str) -> sqlite3.Connection:
    path = os.path.join(movie_db_dir, 'movie_db.sqlite3')
    return sqlite3.connect(path, isolation_level=None)


if __name__ == "__main__":
    update('movie_db_data')
