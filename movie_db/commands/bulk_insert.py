from contextlib import contextmanager


@contextmanager
def bulk_insert(db):
    """Responsible for wrapping a bulk-insert operation.

    Arguments:
        db {sqlite3.Connection} -- The database connection.
    """
    try:
        db.execute('PRAGMA foreign_keys = OFF')
        db.execute('PRAGMA synchronous = OFF')
        db.execute('PRAGMA journal_mode = MEMORY')
        yield
    finally:
        db.commit()
        db.execute('PRAGMA journal_mode = DELETE')
        db.execute('PRAGMA synchronous = ON')
        db.execute('PRAGMA foreign_keys = ON')
