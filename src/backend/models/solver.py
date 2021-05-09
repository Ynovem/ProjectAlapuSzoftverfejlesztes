from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, Text

from db.base_class import Base
from db.database import engine

if TYPE_CHECKING:
    from .item import Item  # noqa: F401


class Solver(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, index=True)
    description = Column(Text, index=True)


Solver.__table__.create(bind=engine, checkfirst=True)
