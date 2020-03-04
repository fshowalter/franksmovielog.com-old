import sqlite3
from contextlib import contextmanager
from os import path

DB_FILE_NAME = 'movie_db.sqlite3'
DB_DIR = 'movie_db_data'


@contextmanager
def db():
    connection = sqlite3.connect(path.join(DB_DIR, DB_FILE_NAME), isolation_level=None)
    yield connection
    connection.close()


@contextmanager
def transaction(connection):
    connection.execute('PRAGMA journal_mode = WAL;')
    connection.execute('BEGIN TRANSACTION;')
    yield
    connection.commit()
    connection.execute('PRAGMA journal_mode = DELETE')
