from typing import Optional, cast

from prompt_toolkit import key_binding
from prompt_toolkit import prompt as toolkit_prompt


def prompt(message: str) -> Optional[str]:
    bindings = key_binding.KeyBindings()

    @bindings.add('escape')  # type: ignore  # noqa WPS430
    def exit_prompt_(event: key_binding.key_processor.KeyPressEvent) -> None:
        """ Exit when `ESC` is pressed. """
        event.app.exit()

    return cast(
        Optional[str],
        toolkit_prompt(message, key_bindings=bindings, rprompt='ESC to go back'),
    )
