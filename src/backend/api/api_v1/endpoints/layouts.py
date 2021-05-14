from typing import Any, List

from fastapi import APIRouter, Depends
# from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

import crud
import schemas
from api import deps

router = APIRouter()


@router.get("", response_model=List[schemas.Layout])
def read_layouts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve layouts.
    """
    layouts = crud.layout.get_multi(db, skip=skip, limit=limit)
    return layouts


@router.post("", response_model=schemas.Layout)
def create_layout(
    *,
    db: Session = Depends(deps.get_db),
    layout_in: schemas.LayoutCreate
) -> Any:
    """
    Create new layout.
    """
    print(f'Layout - Create: {layout_in}')
    layout = crud.layout.create(db, obj_in=layout_in)
    return layout


@router.get("/{layout_id}", response_model=schemas.Layout)
def read_layout_by_id(
    layout_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific layout by id.
    """
    layout = crud.layout.get(db, id=layout_id)
    return layout
