from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


# Shared properties
class LayoutBase(BaseModel):
    name: str
    coords: str


# Properties to receive via API on creation
class LayoutCreate(LayoutBase):
    pass


class LayoutInDBBase(LayoutBase):
    id: Optional[int] = None
    created: datetime = None
    name: str = None
    coords: str = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Layout(LayoutInDBBase):
    pass


# Additional properties stored in DB
class LayoutInDB(LayoutInDBBase):
    pass
