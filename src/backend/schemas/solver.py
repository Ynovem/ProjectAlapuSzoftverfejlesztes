from typing import Optional

from pydantic import BaseModel


# Shared properties
class SolverBase(BaseModel):
    name: str
    description: str


class SolverCreate(SolverBase):
    pass


class SolverInDBBase(SolverBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Solver(SolverInDBBase):
    pass


class SolverData(BaseModel):
    layout_id: int
