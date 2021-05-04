from typing import List, Optional

from sqlalchemy.orm import Session

from models.layout import Layout
from schemas.layout import LayoutCreate


# class CRUDUser(CRUDBase[Layout, LayoutCreate]):
class CRUDLayout:
    def get(self, db: Session, id: int) -> Optional[Layout]:
        return db.query(Layout).filter(Layout.id == id).first()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Layout]:
        return db.query(Layout).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: LayoutCreate) -> Layout:
        # pass
        db_obj = Layout(
            coords=obj_in.coords
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


layout = CRUDLayout()
