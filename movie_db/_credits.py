from dataclasses import asdict, dataclass
from typing import List, Optional, Sequence, Tuple

from movie_db import _db, _imdb_s3_downloader, _imdb_s3_extractor, _movies, _table_base, humanize
from movie_db.logger import logger

FILE_NAME = 'title.crew.tsv.gz'
DIRECTING_CREDITS_TABLE_NAME = 'directing_credits'
WRITING_CREDITS_TABLE_NAME = 'writing_credits'


@dataclass
class Credit(object):
    movie_imdb_id: str
    person_imdb_id: str
    sequence: str

    def __init__(self, movie_imdb_id: str, person_imdb_id: str, sequence: str) -> None:
        self.movie_imdb_id = movie_imdb_id
        self.person_imdb_id = person_imdb_id
        self.sequence = sequence


class CreditsTable(_table_base.TableBase):
    def __init__(self, table_name: str) -> None:
        super().__init__(table_name)

    def drop_and_create(self) -> None:
        ddl = """
        DROP TABLE IF EXISTS "{0}";
        CREATE TABLE "{0}" (
            "movie_imdb_id" varchar(255) NOT NULL
                REFERENCES movies(imdb_id) DEFERRABLE INITIALLY DEFERRED,
            "person_imdb_id" varchar(255) NOT NULL
                REFERENCES people(imdb_id) DEFERRABLE INITIALLY DEFERRED,
            "sequence" INT NOT NULL,
            PRIMARY KEY (movie_imdb_id, person_imdb_id));
        """.format(self.table_name)

        super()._drop_and_create(ddl)

    def insert(self, credits: Sequence[Credit]) -> None:
        ddl = """
        INSERT INTO {0} (movie_imdb_id, person_imdb_id, sequence)
        VALUES(:movie_imdb_id, :person_imdb_id, :sequence);
        """.format(self.table_name)

        parameter_seq = [asdict(credit) for credit in credits]

        super()._insert(ddl=ddl, parameter_seq=parameter_seq)
        super()._add_index('person_imdb_id')
        super()._validate(credits)


def update() -> None:
    logger.log(
        '==== Begin updating {} and {}...',
        DIRECTING_CREDITS_TABLE_NAME,
        WRITING_CREDITS_TABLE_NAME,
    )

    downloaded_file_path = _imdb_s3_downloader.download(FILE_NAME, _db.DB_DIR)

    for _ in _imdb_s3_extractor.checkpoint(downloaded_file_path):
        directing_credits, writing_credits = _extract_credits(downloaded_file_path)
        directing_credits_table = CreditsTable(DIRECTING_CREDITS_TABLE_NAME)
        directing_credits_table.drop_and_create()
        directing_credits_table.insert(directing_credits)
        writing_credits_table = CreditsTable(WRITING_CREDITS_TABLE_NAME)
        writing_credits_table.drop_and_create()
        writing_credits_table.insert(writing_credits)


def _extract_credits(
    downloaded_file_path: str,
) -> Tuple[List[Credit], List[Credit]]:
    title_ids = _movies.title_ids()
    directing_credits: List[Credit] = []
    writing_credits: List[Credit] = []

    for fields in _imdb_s3_extractor.extract(downloaded_file_path):
        title_id = fields[0]
        if title_id in title_ids:
            directing_credits.extend(_fields_to_credits(fields, 1))
            writing_credits.extend(_fields_to_credits(fields, 2))

    logger.log(
        'Extracted {} {}.',
        humanize.intcomma(len(directing_credits)),
        DIRECTING_CREDITS_TABLE_NAME,
    )
    logger.log(
        'Extracted {} {}.',
        humanize.intcomma(len(writing_credits)),
        WRITING_CREDITS_TABLE_NAME,
    )

    return (directing_credits, writing_credits)


def _fields_to_credits(fields: List[Optional[str]], credit_index: int) -> List[Credit]:
    credits: List[Credit] = []

    if fields[credit_index] is None:
        return credits

    for sequence, person_imdb_id in enumerate(str(fields[credit_index]).split(',')):
        credits.append(Credit(
            movie_imdb_id=str(fields[0]),
            person_imdb_id=person_imdb_id,
            sequence=str(sequence),
        ))

    return credits
