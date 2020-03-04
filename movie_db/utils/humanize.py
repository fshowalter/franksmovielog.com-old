# lifted from https://github.com/jmoiron/humanize/blob/master/src/humanize/number.py

import re


def intcomma(value):  # noqa: WPS110
    """Converts an integer to a string containing commas every three digits.
    For example, 3000 becomes '3,000' and 45000 becomes '45,000'.  To maintain
    some compatibility with Django's intcomma, this function also accepts
    floats."""
    try:
        if isinstance(value, str):
            float(value.replace(',', ''))
        else:
            float(value)
    except (TypeError, ValueError):
        return value
    orig = str(value)
    new = re.sub(r'^(-?\d+)(\d{3})', r'\g<1>,\g<2>', orig)
    if orig == new:
        return new

    return intcomma(new)
