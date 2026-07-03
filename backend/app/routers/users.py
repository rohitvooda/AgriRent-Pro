from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.user import UserUpdate, UserResponse
from ..dependencies import get_current_user
from ..models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.put("/profile", response_model=UserResponse)
def update_profile(
    user_in: UserUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Update profile information of the logged-in user."""
    # Check if updating email, and if new email already exists
    if user_in.email and user_in.email != current_user.email:
        existing_user = db.query(User).filter(User.email == user_in.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address already in use."
            )
            
    # Apply updates
    update_data = user_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
        
    db.commit()
    db.refresh(current_user)
    return current_user
