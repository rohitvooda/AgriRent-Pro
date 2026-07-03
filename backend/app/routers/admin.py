from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID
from typing import List, Dict, Any
from ..database import get_db
from ..models.user import User
from ..models.equipment import Equipment
from ..models.booking import Booking
from ..models.payment import Payment
from ..schemas.user import UserResponse
from ..dependencies import get_admin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/dashboard", response_model=Dict[str, Any])
def get_dashboard_metrics(
    current_user: User = Depends(get_admin),
    db: Session = Depends(get_db)
):
    """Retrieve platform metrics and analytics for administrative use."""
    total_farmers = db.query(User).filter(User.role == "farmer").count()
    total_owners = db.query(User).filter(User.role == "owner").count()
    total_equipment = db.query(Equipment).count()
    total_bookings = db.query(Booking).count()
    
    # Calculate total revenue from completed payments
    revenue_sum = db.query(func.sum(Payment.amount)).filter(Payment.payment_status == "completed").scalar()
    total_revenue = float(revenue_sum) if revenue_sum is not None else 0.0
    
    # Fetch recent bookings (limit 5)
    recent_bookings = db.query(Booking).order_by(Booking.created_at.desc()).limit(5).all()
    recent_bookings_data = [
        {
            "id": str(b.id),
            "farmer_name": b.farmer.name,
            "equipment_name": b.equipment.name,
            "total_price": float(b.total_price),
            "status": b.status,
            "created_at": b.created_at.isoformat() if b.created_at else None
        }
        for b in recent_bookings
    ]
    
    return {
        "metrics": {
            "total_farmers": total_farmers,
            "total_owners": total_owners,
            "total_listings": total_equipment,
            "total_bookings": total_bookings,
            "total_revenue": total_revenue
        },
        "recent_bookings": recent_bookings_data
    }

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    current_user: User = Depends(get_admin),
    db: Session = Depends(get_db)
):
    """List all registered users on the platform."""
    return db.query(User).all()

@router.put("/users/{id}/role", response_model=UserResponse)
def update_user_role(
    id: UUID,
    role: str,
    current_user: User = Depends(get_admin),
    db: Session = Depends(get_db)
):
    """Update a user's access role (admin/owner/farmer)."""
    if role not in ["farmer", "owner", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'farmer', 'owner', or 'admin'."
        )
        
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
        
    user.role = role
    db.commit()
    db.refresh(user)
    return user
