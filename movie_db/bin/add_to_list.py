#!/Users/fshowalt/workspace/frankshowalter/.venv/bin/python3

"""
list prompt example
"""
from __future__ import print_function, unicode_literals

from pprint import pprint

from PyInquirer import style_from_dict, Token, prompt, Separator
import movie_db

DIRECTOR = 'director'


def search_directors(answers):


questions = [
    {
        'type': 'list',
        'name': 'type',
        'message': 'What do you want to do?',
        'choices': [
            {
                'name': 'Add a performer',
                'disabled': 'Unavailable at this time',
            },
            {
                'name': 'Add a director',
                'value': DIRECTOR,
            },
            {
                'name': 'Add a movie',
                'disabled': 'Unavailable at this time',
            },

            {
                'name': 'Add a writer',
                'disabled': 'Unavailable at this time',
            },
        ]
    },
    {
        'type': 'input',
        'name': 'query',
        'message': 'Director\'s name?',
    },
    {
        'type': 'list',
        'name': 'selection',
        'message': lambda answers: 'Results for "{0}"'.format(answers['query']),
        'choices': search_directors,
    }
]

answers = prompt(questions)
pprint(answers)
