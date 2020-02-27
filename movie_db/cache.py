import gzip
import pickle
import os
from typing import List, Dict, Optional, Any, Callable, TypeVar
import utils.formatter as formatter
from utils.spinner import start_spinner, stop_spinner
import datetime


def read(file: str) -> Optional[Dict[str, Any]]:
    cache_file = _cache_filename(file)
    cache = None
    if os.path.exists(cache_file):
        print(formatter.h2(f"Cache found at {cache_file}"))
        spinner = start_spinner(f"Reading {file} from cache...")
        with(open(cache_file, 'rb')) as cached_file:
            cache = pickle.load(cached_file)
        stop_spinner(spinner, f"Loaded {file} from cache.")
    return cache


def write(data: Dict[str, Any], filename: str):
    cache_file = _cache_filename(filename)
    with(open(cache_file, 'wb')) as file:
        pickle.dump(data, file)


def _cache_filename(file: str) -> str:
    return f'{file}.cache'
