from typing import Any, List, Dict, Optional, Union

from sqlalchemy.orm import Session

# from app.core.security import get_password_hash, verify_password
from core.security import get_password_hash, verify_password
# from app.crud.base import CRUDBase
# from crud.base import CRUDBase
# from app.models.user import User
from models.user import User
# from app.schemas.user import UserCreate, UserUpdate
from schemas.user import UserCreate, UserUpdate


# class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
class CRUDUser:
    def get(self, db: Session, id: Any) -> Optional[User]:
        return db.query(User).filter(User.id == id).first()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[User]:
        return db.query(User).offset(skip).limit(limit).all()

    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        print(f'get_by_email: {email} => {db.query(User).all()}')
        return db.query(User).filter(User.email == email).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        pass
        db_obj = User(
            email=obj_in.email,
            password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            is_superuser=obj_in.is_superuser,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        pass
        # if isinstance(obj_in, dict):
        #     update_data = obj_in
        # else:
        #     update_data = obj_in.dict(exclude_unset=True)
        # if update_data["password"]:
        #     hashed_password = get_password_hash(update_data["password"])
        #     del update_data["password"]
        #     update_data["hashed_password"] = hashed_password
        # return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        print(user)
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser


# user = CRUDUser(User)
user = CRUDUser()
