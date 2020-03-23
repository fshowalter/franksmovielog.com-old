from movie_db import _watchlist, _watchlist_titles

Collection = _watchlist.Collection


def add_collection(name: str) -> _watchlist.Collection:
    collection_watchlist_item = _watchlist.Collection.new(name=name)
    collection_watchlist_item.save()
    return collection_watchlist_item


def update_collection(collection: _watchlist.Collection) -> _watchlist.Collection:
    collection.save()
    return collection


def add_director(imdb_id: str, name: str) -> _watchlist.Director:
    director_watchlist_item = _watchlist.Director.new(imdb_id=imdb_id, name=name)
    director_watchlist_item.save()
    director_watchlist_item.refresh_item_titles()
    return director_watchlist_item


def add_performer(imdb_id: str, name: str) -> _watchlist.Performer:
    performer_watchlist_item = _watchlist.Performer.new(imdb_id=imdb_id, name=name)
    performer_watchlist_item.save()
    performer_watchlist_item.refresh_item_titles()
    return performer_watchlist_item


def add_writer(imdb_id: str, name: str) -> _watchlist.Writer:
    writer_watchlist_item = _watchlist.Writer.new(imdb_id=imdb_id, name=name)
    writer_watchlist_item.save()
    writer_watchlist_item.refresh_item_titles()
    return writer_watchlist_item


def update_titles_for_people() -> None:
    _watchlist.Director.refresh_all_item_titles()
    _watchlist.Performer.refresh_all_item_titles()
    _watchlist.Writer.refresh_all_item_titles()
    _watchlist_titles.update()
