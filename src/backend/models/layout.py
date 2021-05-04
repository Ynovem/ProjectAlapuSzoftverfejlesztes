from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, Text

from db.base_class import Base
from db.database import engine

if TYPE_CHECKING:
    from .item import Item  # noqa: F401


class Layout(Base):
    id = Column(Integer, primary_key=True, index=True)
    coords = Column(Text, index=False)


Layout.__table__.create(bind=engine, checkfirst=True)
