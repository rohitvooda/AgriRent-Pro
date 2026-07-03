from sqlalchemy.orm import Session
from typing import Optional
from ..models.user import User
from ..schemas.user import UserCreate
from ..utils.hash import hash_password, verify_password

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Retrieve a user by their email address."""
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    """Retrieve a user by their unique database ID."""
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user_in: UserCreate) -> User:
    """Create a new user with a hashed password in the database."""
    hashed_pwd = hash_password(user_in.password)
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        name=user_in.name,
        role=user_in.role,
        phone=user_in.phone,
        address=user_in.address
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password. Returns user or None."""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
