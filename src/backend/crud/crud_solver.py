from typing import List, Optional

from sqlalchemy.orm import Session

from models.solver import Solver


class CRUDSolver:
    def get(self, db: Session, id: int) -> Optional[Solver]:
        return db.query(Solver).filter(Solver.id == id).first()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Solver]:
        return db.query(Solver).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: Solver) -> Solver:
        db_obj = Solver(
            id=None,
            name=obj_in.name,
            description=obj_in.description,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


solver = CRUDSolver()
