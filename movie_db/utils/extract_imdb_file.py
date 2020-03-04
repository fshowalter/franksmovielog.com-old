import gzip

from utils.logger import logger


def extract_imdb_file(file_path):
    logger.log('Begin extracting from {}...', file_path)

    with gzip.open(filename=file_path, mode='rt', encoding='utf-8') as gz_file:
        headers_length = len(gz_file.readline().strip().split('\t'))
        for line in gz_file:
            fields = line.strip().split('\t')
            if len(fields) != headers_length:
                continue
            yield fields
