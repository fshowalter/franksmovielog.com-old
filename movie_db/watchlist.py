from movie_db import _watchlist_item

Collection = _watchlist_item.Collection


def add_collection(name: str) -> '_watchlist_item.Collection':
    collection_watchlist_item = _watchlist_item.Collection.new(name=name)
    collection_watchlist_item.save()
    return collection_watchlist_item


def update_collection(
    collection_item: '_watchlist_item.Collection',
) -> '_watchlist_item.Collection':
    collection_item.save()
    return collection_item


def add_director(imdb_id: str, name: str) -> '_watchlist_item.Director':
    director_watchlist_item = _watchlist_item.Director.new(imdb_id=imdb_id, name=name)
    director_watchlist_item.save()
    director_watchlist_item.refresh_item_titles()
    return director_watchlist_item


def add_performer(imdb_id: str, name: str) -> '_watchlist_item.Performer':
    performer_watchlist_item = _watchlist_item.Performer.new(imdb_id=imdb_id, name=name)
    performer_watchlist_item.save()
    performer_watchlist_item.refresh_item_titles()
    return performer_watchlist_item


def add_writer(imdb_id: str, name: str) -> '_watchlist_item.Writer':
    writer_watchlist_item = _watchlist_item.Writer.new(imdb_id=imdb_id, name=name)
    writer_watchlist_item.save()
    writer_watchlist_item.refresh_item_titles()
    return writer_watchlist_item


def update_titles_for_people() -> None:
    # _watchlist_item.Director.refresh_all_item_titles()
    _watchlist_item.Performer.refresh_all_item_titles()
    _watchlist_item.Writer.refresh_all_item_titles()


if __name__ == '__main__':
    update_titles_for_people()
