from halo import Halo


def start_spinner(text):
    spinner = Halo(text=text, spinner='dots', color='blue', placement='right')
    spinner.start()
    return spinner


def stop_spinner(spinner, text):
    spinner.stop_and_persist(text=text)
