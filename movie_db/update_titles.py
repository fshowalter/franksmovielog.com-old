import requests
import datetime
import os
import shlex
import subprocess
import gzip
from typing import List, Dict, Set
from movie import Movie
import sqlite3
from contextlib import contextmanager
from loguru import logger as baselogger
import sys
import humanize

BASE_URL = 'https://datasets.imdbws.com/'
FILE_NAME = 'title.basics.tsv.gz'

logger_config = {
    "handlers": [
        {
            "sink": sys.stdout,
            "format": "<green>{elapsed}</green> | <level>{message}</level> (<cyan>{function}</cyan>:<cyan>{line}</cyan>)",
        }
    ]
}

baselogger.configure(**logger_config)

logger = baselogger.opt(colors=True)


@logger.catch
def update_titles(data_dir: str, existing_title_ids: Set[str]) -> str:
    logger.info("Begin updating titles...")
    url = f"{BASE_URL}{FILE_NAME}"

    last_modified_header = requests.head(url).headers['Last-Modified']
    last_modified_date = datetime.datetime.strptime(last_modified_header, "%a, %d %b %Y %H:%M:%S %Z")
    logger.info("Remote file <green>{}</> last updated <green>{}</>.", FILE_NAME, last_modified_date)

    download_directory = os.path.join(data_dir, last_modified_date.strftime('%Y-%m-%d'))

    if os.path.exists(download_directory):
        logger.info("Directory <green>{}</> already exists.", download_directory)
    else:
        logger.info("Creating directory <green>{}</>...", download_directory)
        os.makedirs(download_directory)

    titles_file = os.path.join(download_directory, FILE_NAME)

    if os.path.exists(titles_file):
        logger.info("File <green>{}</> already exists.", titles_file)
    else:
        logger.info("Downloading <green>{}</>...", titles_file)
        _curl(url, titles_file)

    titles: Dict[str, Movie] = {}

    logger.info("Begin extracting titles...")
    with gzip.open(filename=titles_file, mode='rt', encoding='utf-8') as gz_file:
        headers_length = len(gz_file.readline().strip().split('\t'))
        for line in gz_file:
            fields = line.strip().split('\t')
            if len(fields) != headers_length:
                continue
            title_id = fields[0]
            if title_id not in existing_title_ids:
                if _title_is_valid(fields):
                    titles[title_id] = Movie(
                        title=fields[2],
                        original_title=fields[3],
                        year=fields[5],
                        runtime_minutes=fields[7])

    logger.info("Extracted <green>{}</> titles.", humanize.intcomma(len(titles)))

    conn = _init_db(data_dir)
    cursor = conn.cursor()
    logger.info("Creating <green>movies</> table...")
    cursor.executescript("""
    DROP TABLE IF EXISTS "movies";
    CREATE TABLE "movies" (
        "id" TEXT PRIMARY KEY NOT NULL,
        "title" TEXT NOT NULL,
        "year" INT NOT NULL,
        "runtime_minutes" INT);
    """)

    logger.info("Inserting titles...")
    cursor.execute('''PRAGMA foreign_keys = OFF''')
    cursor.execute('''PRAGMA synchronous = EXTRA''')
    cursor.execute('''PRAGMA journal_mode = WAL''')
    cursor.execute('''BEGIN TRANSACTION;''')
    cursor.executemany("""
      INSERT INTO movies(id, title, year, runtime_minutes)
      VALUES(?, ?, ?, ?)""", [(imdb_id, movie.title, movie.year, movie.runtime_minutes) for (imdb_id, movie) in titles.items()])
    conn.commit()
    conn.close()
    logger.info("Done!")


def _curl(url: str, dest: str):
    cmd = f"curl --fail --progress-bar -o {dest} {url}"
    args = shlex.split(cmd)
    process = subprocess.Popen(args, shell=False)
    _stdout, stderr = process.communicate()


def _titles_to_tuple(titles):
    for (imdb_id, movie) in titles.items():
        yield (imdb_id, movie.title, movie.year, movie.runtime_minutes)


def _title_is_valid(title_line: List[str]) -> bool:
    if title_line[1] != 'movie':
        return False
    if title_line[4] == '1':
        return False
    if title_line[5] == '\\N':
        return False
    return True


def _init_db(db_dir: str) -> sqlite3.Connection:
    path = os.path.join(db_dir, 'movie_db.sqlite3')
    return sqlite3.connect(path, isolation_level=None)


@contextmanager
def _bulk_insert(db):
    """Responsible for wrapping a bulk-insert operation.

    Arguments:
        db {sqlite3.Connection} -- The database connection.
    """
    try:
        db.execute('PRAGMA foreign_keys = OFF')
        db.execute('PRAGMA synchronous = EXTRA')
        db.execute('PRAGMA journal_mode = WAL')
        yield
    finally:
        db.execute('PRAGMA journal_mode = DELETE')
        db.execute('PRAGMA synchronous = ON')
        db.execute('PRAGMA foreign_keys = ON')


if __name__ == "__main__":
    update_titles('movie_db_data', set())
