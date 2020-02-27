from typing import List, NamedTuple, Set


class Principal(NamedTuple):
    person_id: str
    sequence: str
    category: str
    job: str
    characters: str


class Movie(NamedTuple):
    title: str
    original_title: str
    year: str
    runtime_minutes: str
    principals: List[Principal] = []
    directors: List[str] = []
    writers: List[str] = []
    aka_titles: Set[str] = set()
