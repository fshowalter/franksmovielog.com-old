import os
from typing import Optional, Sequence

import yaml
from typing_extensions import TypedDict

from movie_db.logger import logger

Movie = TypedDict('Movie', {'imdb_id': str, 'year': int, 'title': str})


def write(
    item_path: str,
    imdb_id: str,
    name: str,
    frozen: bool = False,
    titles: Optional[Sequence[Movie]] = None,
) -> str:

    output = yaml.dump(
        {
            'imdb_id': imdb_id,
            'name': name,
            'frozen': frozen,
            'titles': titles,
        },
        encoding='utf-8',
        allow_unicode=True,
        default_flow_style=False,
    )

    if not os.path.exists(os.path.dirname(item_path)):
        os.makedirs(os.path.dirname(item_path))

    with open(item_path, 'wb') as output_file:
        output_file.write(output)

    logger.log('Wrote {} ({}) to {}', name, imdb_id, item_path)

    return item_path
