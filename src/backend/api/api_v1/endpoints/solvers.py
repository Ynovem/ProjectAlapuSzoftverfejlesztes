import json
from typing import Any, List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

import crud
import schemas
from api import deps
from schemas.solver import SolverData

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


@router.post("/{solver_id}", response_model=schemas.Layout)
def solve_layout(
    solver_id: int,
    body: SolverData,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Solve the layout.
    """
    print(f"Solve! {solver_id}")
    print(f'Body: {body}')

    layout = crud.layout.get(db, id=body.layout_id)

    print(f'Body: {layout}')
    print(f'Coords: {json.loads(layout.coords)}')

    # return layout
    return {
        "name": "test",
        "coords": "testtest",
    }
