import gzip
from typing import Generator, List, Union

from utils.logger import logger


def extract_imdb_file(
    file_path: str,
) -> Generator[List[Union[str, None]], None, None]:  # noqa: TAE002
    logger.log('Begin extracting from {}...', file_path)

    with gzip.open(filename=file_path, mode='rt', encoding='utf-8') as gz_file:
        headers_length = len(gz_file.readline().strip().split('\t'))
        for line in gz_file:
            fields = line.strip().split('\t')
            if len(fields) != headers_length:
                continue

            yield _parse_fields(fields)


def _parse_fields(fields: List[Union[str, None]]) -> List[Union[str, None]]:  # noqa: WPS221
    for index, field in enumerate(fields):
        if field == r'\N':
            fields[index] = None

    return fields
