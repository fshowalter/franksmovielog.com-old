import colorful as cf
from typing import Optional


def identifier(string) -> str:
    return f"{cf.green}{string}{cf.reset}"


def h1(string) -> str:
    return _heading(string, color='green')


def h2(string) -> str:
    return _heading(string, color='blue')


def success(string) -> str:
    return _prefix(prefix="✔  ", string=string, color='green')


def _arrow(string: str, color: str = None) -> str:
    return _prefix(prefix="==>", string=string, color=color)


def _heading(string, color: str = None) -> str:
    return _arrow(f'{cf.bold}{string}{cf.reset}', color=color)


def _prefix(prefix: str, string: str, color: Optional[str]) -> str:
    if (prefix is None) and (color is None):
        return string

    if prefix is None:
        return f"{getattr(cf, color)}#{string}{cf.reset}"

    if color is None:
        return f"{prefix} {string}"

    return f"{getattr(cf, color)}{prefix}{cf.reset} {string}"
