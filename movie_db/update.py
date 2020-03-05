from update_aka_titles import update_aka_titles
from update_directing_and_writing_credits import update_directing_and_writing_credits
from update_movies import update_movies
from update_people import update_people
from update_principals import update_principals
from utils.logger import logger


@logger.catch
def update() -> None:
    update_movies()
    update_people()
    update_directing_and_writing_credits()
    update_aka_titles()
    update_principals()


if __name__ == '__main__':
    update()
