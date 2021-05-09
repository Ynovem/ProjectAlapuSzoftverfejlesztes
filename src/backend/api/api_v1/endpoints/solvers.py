from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
import schemas
from api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.Solver])
def read_solvers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve solvers.
    """
    return crud.solver.get_multi(db, skip=skip, limit=limit)
