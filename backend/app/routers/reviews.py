from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from ..database import get_db
from ..schemas.review import ReviewCreate, ReviewResponse
from ..services import booking_service
from ..dependencies import get_farmer
from ..models.user import User
from ..models.review import Review
from ..models.booking import Booking

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def leave_review(
    review_in: ReviewCreate,
    current_user: User = Depends(get_farmer),
    db: Session = Depends(get_db)
):
    """Leave a review and rating (1-5) for a booking. Farmer only."""
    booking = booking_service.get_booking_by_id(db, review_in.booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking record not found."
        )
        
    if booking.farmer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only review bookings that you scheduled."
        )
        
    # Check if a review already exists for this booking
    existing_review = db.query(Review).filter(Review.booking_id == review_in.booking_id).first()
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted a review for this booking."
        )
        
    # Create review
    db_review = Review(
        booking_id=review_in.booking_id,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/equipment/{equipment_id}", response_model=List[ReviewResponse])
def get_equipment_reviews(equipment_id: UUID, db: Session = Depends(get_db)):
    """Retrieve all ratings and reviews submitted for a specific equipment listing."""
    reviews = db.query(Review).join(Booking).filter(Booking.equipment_id == equipment_id).all()
    return reviews
