from typing import List, Optional

from sqlalchemy.orm import Session

from models.rule import Rule


class CRUDRule:
    def get(self, db: Session, id: int) -> Optional[Rule]:
        return db.query(Rule).filter(Rule.id == id).first()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Rule]:
        return db.query(Rule).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: Rule) -> Rule:
        db_obj = Rule(
            id=None,
            name=obj_in.name,
            limit=obj_in.limit,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


rule = CRUDRule()
