### Install dependencies
`pipenv install`

### Prepare database
`pipenv run python prepare_db.py`

### Run server
`pipenv run uvicorn main:app --reload`

### Setup PyCharm
File -> Settings...
Project: backend -> Python interpreter -> Add -> Pipenv interpreter Python 3.8

### Links
https://github.com/tiangolo/full-stack-fastapi-postgresql
https://realpython.com/python-sqlite-sqlalchemy/
https://fastapi.tiangolo.com/tutorial/sql-databases/
