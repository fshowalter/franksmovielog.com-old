from typing import Iterable, Any, Optional


class tqdm(Iterable):

    def __init__(
            self,
            desc: str,
            iterable: Optional[Iterable[Any]] = None,
            total: Optional[int] = 0,
            initial: Optional[int] = 0,
            minters: Optional[int] = 0,
            unit_scale: Optional[bool] = False,
            unit: Optional[str] = ''):
        ...

    def __iter__(self):
        ...

    def set_description_str(self, desc: str):
        ...

    def update(self, increment: int):
        ...

    def close(self):
        ...
