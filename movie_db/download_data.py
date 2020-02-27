from datetime import datetime
import utils.formatter as formatter
import os
import shlex
import subprocess

BASE_URL = 'https://datasets.imdbws.com/'

FILES_TO_DOWNLOAD = (
    'name.basics.tsv.gz',
    'title.akas.tsv.gz',
    'title.basics.tsv.gz',
    'title.crew.tsv.gz',
    'title.principals.tsv.gz',
    'title.ratings.tsv.gz'
)


def download_data() -> str:
    """Downloads the available files from the IMDb.

    Returns:
        str -- The path to the downloaded files.
    """
    download_directory = _ensure_directory(root='movie_db_data')

    for file_to_download in FILES_TO_DOWNLOAD:
        print(formatter.h1(f"Downloading {formatter.identifier(file_to_download)}"))
        url = BASE_URL + file_to_download
        file_to_write = os.path.join(download_directory, file_to_download)
        print(formatter.h2(f"Downloading to {file_to_write}"))

        if os.path.exists(file_to_write):
            print(f'{file_to_write} already exists, skipping.')
            continue

        _curl(url, file_to_write)

    return download_directory


if __name__ == "__main__":
    download_data()


def _curl(url: str, dest: str):
    print(formatter.h2(f"Downloading from {url}"))
    cmd = f"curl --fail --progress-bar -o {dest} {url}"
    args = shlex.split(cmd)
    process = subprocess.Popen(args, shell=False)
    _stdout, stderr = process.communicate()


def _ensure_directory(root: str) -> str:
    directory = os.path.join(
        root, datetime.today().strftime('%Y-%m-%d'))

    if not os.path.exists(directory):
        os.makedirs(directory)

    return directory
