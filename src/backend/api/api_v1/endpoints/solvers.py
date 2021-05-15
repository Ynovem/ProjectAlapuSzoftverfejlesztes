import json
from typing import Any, List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

import crud
import schemas
from api import deps
from schemas import Rule, Layout
from schemas.solver import SolverData
from solvers.first_free.first_free_solver import FirstFree
from solvers.backtracking.backtracking_solver import Backtracking
from solvers.maximal_independent_set.maximal_independent_set import MaximalIndependentSet
from solvers.minimum_degree.minimum_degree import MinimumDegree
from  solvers.forward_selection.forward_selection import ForwardSelection

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

    rule: Optional[Rule] = crud.rule.get(db, id=body.rule_id)
    if rule is None:
        # TODO: Error handling
        pass

    layout: Optional[Layout] = crud.layout.get(db, id=body.layout_id)
    if layout is None:
        # TODO: Error handling
        pass

    print(f'Body: {layout}')
    print(f'Name: {layout.name}')
    print(f'Coords: {json.loads(layout.coords)}')
    algorithm = Backtracking(rule)
    if solver_id == 1:
        algorithm = Backtracking(rule)
    elif solver_id == 2:
        algorithm = FirstFree(rule)
    elif solver_id == 3:
        algorithm = MaximalIndependentSet(rule)
    elif solver_id == 4:
        algorithm = MinimumDegree(rule)
    elif solver_id == 5:
        algorithm = ForwardSelection(rule)

    return algorithm.solve(layout)
