from typing import Optional, Sequence, Tuple, TypeVar, cast

from prompt_toolkit.application import Application
from prompt_toolkit.formatted_text import HTML
from prompt_toolkit.key_binding.defaults import load_key_bindings
from prompt_toolkit.key_binding.key_bindings import KeyBindings, merge_key_bindings
from prompt_toolkit.key_binding.key_processor import KeyPressEvent
from prompt_toolkit.layout import Layout
from prompt_toolkit.layout.containers import HSplit
from prompt_toolkit.widgets import Label, RadioList

_T = TypeVar('_T')  # noqa: WPS111


def radio_list(title: str, options: Sequence[Tuple[_T, HTML]]) -> Optional[_T]:
    control = RadioList(options)

    # Add exit key binding.
    bindings = KeyBindings()

    @bindings.add('c-d')  # noqa: WPS430
    def exit_(event: KeyPressEvent) -> None:
        """
        Pressing Ctrl-d will exit the user interface.
        """
        event.app.exit()

    @bindings.add('enter', eager=True)  # noqa: WPS430
    def exit_with_value(event: KeyPressEvent) -> None:
        """
        Pressing Ctrl-a will exit the user interface returning the selected value.
        """
        control._handle_enter()  # noqa: WPS437
        event.app.exit(result=control.current_value)

    application = Application(
        layout=Layout(HSplit([Label(title), control])),
        key_bindings=merge_key_bindings([load_key_bindings(), bindings]),
        mouse_support=True,
        full_screen=False,
    )

    return cast(Optional[_T], application.run())
