from commands.bulk_insert import bulk_insert
from commands.create_cast_and_crew_tables import create_cast_and_crew_tables
from utils.spinner import start_spinner, stop_spinner


def reload_cast_and_crew(db, cast_and_crew, titles):
    with bulk_insert(db):
        create_cast_and_crew_tables(db=db)
        _insert_cast_and_crew(db=db, cast_and_crew=cast_and_crew, titles=titles)


def _insert_cast_and_crew(db, cast_and_crew, titles):
    _insert_people(db=db, cast_and_crew=cast_and_crew)
    _insert_principals(db=db, titles=titles)


def _insert_people(db, cast_and_crew):
    def people_to_tuple():
        for (id, person) in cast_and_crew.items():
            print(id, person)
            yield (id, person.full_name, person.last_name, person.first_name)

    spinner = start_spinner('Inserting people...')
    db.executemany("""
        INSERT INTO people(id, full_name, last_name, first_name)
        VALUES(?, ?, ?, ?)""", people_to_tuple())
    stop_spinner(spinner, f'Inserted {len(cast_and_crew):,} people.')


def _insert_principals(db, titles):
    def principals_to_tuple():
        for (id, title) in titles.items():
            if 'principals' not in title:
                continue
            for principal in title['principals']:
                yield(
                    id,
                    principal['person_id'],
                    principal['sequence'],
                    principal['category'],
                    principal['job'],
                    principal['characters'])

    spinner = start_spinner('Inserting principals...')
    db.executemany("""
        INSERT INTO principals(movie_id, person_id, sequence, category, job, characters)
        VALUES(?, ?, ?, ?, ?, ?)""", principals_to_tuple())
    principals_length = sum(len(title['principals']) for title in titles)
    stop_spinner(spinner, f'Inserted {principals_length:,} principals.')
