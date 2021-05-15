from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


# Shared properties
class LayoutSolvedBase(BaseModel):
    name: str
    coords: str
    rule_id: int
    solver_id: int


# Properties to receive via API on creation
class LayoutSolvedCreate(LayoutSolvedBase):
    pass


class LayoutSolvedInDBBase(LayoutSolvedBase):
    id: Optional[int] = None
    created: datetime = None
    name: str = None
    coords: str = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class LayoutSolved(LayoutSolvedInDBBase):
    pass


# Additional properties stored in DB
class LayoutSolvedInDB(LayoutSolvedInDBBase):
    pass
