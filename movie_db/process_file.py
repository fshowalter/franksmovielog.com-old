"""Repsonbile for parsing imdb files.
"""
import gzip
import marshal
import os
import re
import types
from halo import Halo

FILENAME_REGEX = re.compile(r'^.*/([^.]*)\.(.*).tsv.gz')


def process_file(accumulator, file, validator):
    """Responsible for processing IMDb files.

    Arguments:
        accumulator {dict} -- The object responsible for accumulating the file's values.
        file {string} -- The path to the file to process.
        validator {func} -- Validation function to determine if a given line is valid.

    Returns:
        dict -- The accumlator with the processed data, or the cached value if present.
    """
    cache = _read_cache_for_file(file)
    if cache is not None:
        return cache

    spinner = _init_progress(file)

    with gzip.GzipFile(file, 'rb') as gz_file:
        for _ in gz_file:
            spinner.update()
            line = _decode_line(gz_file)
            if validator(line):
                spinner.passed += 1
            spinner.line_count += 1

    spinner.finish()
    _write_cache_for_file(accumulator, file)

    return accumulator


def _init_progress(file):
    kind = _format_filename(file)
    spinner = Halo(text='Processing {}...'.format(kind), spinner='dots')
    spinner.start()

    def update():
        spinner.text = 'Parsing {} line {} / {} passed...'.format(
            file,
            '{:,}'.format(progress.line_count),
            '{:,}'.format(progress.passed))

    def finish():
        spinner.succeed('Found {} {}!'.format('{:,}'.format(progress.passed), kind))

    progress = types.SimpleNamespace()

    progress.update = update
    progress.finish = finish
    progress.line_count = 1
    progress.passed = 0

    return progress


def _format_filename(file):
    match = FILENAME_REGEX.split(file)
    if match[2] == 'basics':
        return '{}s'.format(match[1])
    return match[2]


def _decode_line(gz_file):
    byte_line = gz_file.readline()
    return byte_line.decode('utf-8').strip().split('\t')


def _cache_filename(file):
    return '{}.cache'.format(file)


def _read_cache_for_file(file):
    cache_file = _cache_filename(file)
    if os.path.exists(cache_file):
        with(open(cache_file, 'rb')) as cached_file:
            return marshal.load(cached_file)
    return None


def _write_cache_for_file(data, file):
    cache_file = _cache_filename(file)
    with(open(cache_file, 'wb')) as file:
        marshal.dump(data, file)
