import gzip
import pickle
import os
from typing import List, Dict, Optional, Any, Callable, TypeVar, NamedTuple
import utils.formatter as formatter
from utils.spinner import start_spinner, stop_spinner
import datetime

T = TypeVar('T')


class ProcessableFile(NamedTuple):
    file: str
    line_callback: Callable[List[str]]
    cache_found_callback: Callable[Any]
    summary_callback: Callable[Any]


def process_file(file: str, callback: Callable[[List[str]], Dict[str, T]]) -> Dict[str, T]:
    """Responsible for processing the given imdb file.

    Args:
        file (str): File name to process.
        callback (function): Called with each set of items in the file. Must return the
            accumulated output.

    Returns:
        dict: The output of the last callback.
    """
    print(formatter.h1(f"Processing {formatter.identifier(file)}"))
    start_time = datetime.datetime.now()

    # cache = _read_cache_for_file(file)
    # if cache:
    #     return cache

    output: Dict[str, Any] = {}

    spinner = start_spinner(formatter.h2(f"Parsing {file}"))

    with gzip.open(filename=file, mode='rt', encoding='utf-8') as gz_file:
        headers_length = len(gz_file.readline().strip().split('\t'))
        total_lines = 0
        for line in gz_file:
            fields = _split_fields(line)
            if len(fields) != headers_length:
                continue
            output = callback(fields)
            total_lines += 1

    process_time = datetime.datetime.now() - start_time
    _write_cache_for_file(output, file)
    stop_spinner(spinner, formatter.h2(f"Processed {file} in {process_time}"))

    return output


def _split_fields(line: str) -> List[str]:
    return line.strip().split('\t')


def _cache_filename(file: str) -> str:
    return f'{file}.cache'


def _read_cache_for_file(file: str) -> Optional[Dict[str, Any]]:
    cache_file = _cache_filename(file)
    cache = None
    if os.path.exists(cache_file):
        print(formatter.h2(f"Cache found at {cache_file}"))
        spinner = start_spinner(f"   Reading {file} from cache...")
        with(open(cache_file, 'rb')) as cached_file:
            cache = pickle.load(cached_file)
        stop_spinner(spinner, f"    Loaded {file} from cache.")
    return cache


def _write_cache_for_file(data: Dict[str, Any], filename: str):
    cache_file = _cache_filename(filename)
    with(open(cache_file, 'wb')) as file:
        pickle.dump(data, file)
