""" Responsible for downloading the raw files from the IMDb."""
from datetime import datetime
from contextlib import contextmanager
import os
import requests
from tqdm import tqdm

BASE_URL = 'https://datasets.imdbws.com/'

FILES_TO_DOWNLOAD = (
    'name.basics.tsv.gz',
    'title.akas.tsv.gz',
    'title.basics.tsv.gz',
    'title.crew.tsv.gz',
    'title.principals.tsv.gz',
    'title.ratings.tsv.gz'
)


def download_data():
    """Downloads the available files from the IMDb.

    Returns:
        str -- The path to the downloaded files.
    """
    download_directory = _ensure_directory(root='movie_db_data')

    for file_to_download in FILES_TO_DOWNLOAD:
        url = BASE_URL + file_to_download
        file_to_write = os.path.join(download_directory, file_to_download)

        if os.path.exists(file_to_write):
            continue

        with(_progress_bar(url)) as progress_bar:
            request = requests.get(url, stream=True)

            with(open(file_to_write, 'ab')) as file:
                for chunk in request.iter_content(chunk_size=1024):
                    _write_chunk(chunk, file)
                    progress_bar.update(1024)

    return download_directory


if __name__ == "__main__":
    download_data()


@contextmanager
def _progress_bar(url):
    file_size = int(requests.head(url).headers["Content-Length"])

    progress_bar = tqdm(
        total=file_size,
        initial=0,
        unit='B',
        unit_scale=True,
        desc=url.split('/')[-1])

    try:
        yield progress_bar
    finally:
        progress_bar.close()


def _write_chunk(chunk, file):
    if chunk:
        file.write(chunk)


def _ensure_directory(root):
    directory = os.path.join(
        root, datetime.today().strftime('%Y-%m-%d'))

    if not os.path.exists(directory):
        os.makedirs(directory)

    return directory
