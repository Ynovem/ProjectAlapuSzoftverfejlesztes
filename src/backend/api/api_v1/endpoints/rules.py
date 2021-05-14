from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
import schemas
from api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.Rule])
def read_rules(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve rules.
    """
    rules = crud.rule.get_multi(db, skip=skip, limit=limit)
    return rules


@router.post("", response_model=schemas.Rule)
def create_rule(
    *,
    db: Session = Depends(deps.get_db),
    rule_in: schemas.RuleCreate
) -> Any:
    """
    Create new rule.
    """
    print(f'Rule - Create: {rule_in}')
    rule = crud.rule.create(db, obj_in=rule_in)
    return rule


@router.get("/{rule_id}", response_model=schemas.Rule)
def read_rule_by_id(
    rule_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific rule by id.
    """
    rule = crud.rule.get(db, id=rule_id)
    return rule
