from datetime import datetime
import os


def ensure_download_directory(root: str) -> str:
    directory = os.path.join(
        root, datetime.today().strftime('%Y-%m-%d'))

    if not os.path.exists(directory):
        os.makedirs(directory)

    return directory
