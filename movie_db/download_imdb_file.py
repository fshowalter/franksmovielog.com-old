import utils.formatter as formatter
import os
import shlex
import subprocess
import humanize
from datetime import datetime

BASE_URL = 'https://datasets.imdbws.com/'


def download_imdb_file(download_directory: str, file_to_download: str) -> str:
    url = BASE_URL + file_to_download
    file_to_write = os.path.join(download_directory, file_to_download)

    if os.path.exists(file_to_write):
        file_size = humanize.naturalsize(os.path.getsize(file_to_write))
        print(formatter.h2(f"{file_to_write} ({file_size}) already downloaded."))
        return file_to_write

    start_time = datetime.now()
    _curl(url, file_to_write)
    download_time = humanize.naturaldelta(datetime.now() - start_time)
    file_size = humanize.naturalsize(os.path.getsize(file_to_write))
    print(f"Downloaded {file_to_write}: {file_size} in {download_time}.")

    return file_to_write


def _curl(url: str, dest: str):
    print(formatter.h2(f"Downloading {url}"))
    cmd = f"curl --fail --progress-bar -o {dest} {url}"
    args = shlex.split(cmd)
    process = subprocess.Popen(args, shell=False)
    _stdout, stderr = process.communicate()
