from typing import NamedTuple


class AkaTitle(NamedTuple):
    movie_id: str
    sequence: int
    title: str
    region: str
    language: str
    types: str
    attributes: str
    is_original_title: bool
