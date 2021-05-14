from typing import Optional

from pydantic import BaseModel


# Shared properties
class RuleBase(BaseModel):
    name: str
    limit: int


class RuleCreate(RuleBase):
    pass


class RuleInDBBase(RuleBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Rule(RuleInDBBase):
    pass


class RuleData(BaseModel):
    rule_id: int
