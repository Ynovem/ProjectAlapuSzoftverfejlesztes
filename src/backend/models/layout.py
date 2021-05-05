from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, Text, DateTime

from db.base_class import Base
from db.database import engine

if TYPE_CHECKING:
    from .item import Item  # noqa: F401


class Layout(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, index=True)
    coords = Column(Text, index=False)
    created = Column(DateTime, default=datetime.utcnow, index=True)


Layout.__table__.create(bind=engine, checkfirst=True)
