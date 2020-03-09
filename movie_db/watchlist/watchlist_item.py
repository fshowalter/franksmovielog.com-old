from typing import NamedTuple, Optional, Set


class WatchlistItem(NamedTuple):
    id: str
    name: str
    notes: Optional[str] = None
    title_ids_to_exclude: Set[str] = set()
