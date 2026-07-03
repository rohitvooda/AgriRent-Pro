from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import date
from ..models.booking import Booking
from ..models.equipment import Equipment
from ..schemas.booking import BookingCreate
from ..utils.helpers import calculate_booking_price

def get_booking_by_id(db: Session, booking_id: UUID) -> Optional[Booking]:
    """Retrieve a booking record by its ID."""
    return db.query(Booking).filter(Booking.id == booking_id).first()

def list_bookings(
    db: Session,
    farmer_id: Optional[UUID] = None,
    owner_id: Optional[UUID] = None,
    status: Optional[str] = None
) -> List[Booking]:
    """List bookings with filters for farmers, owners, and status."""
    query = db.query(Booking)
    
    if farmer_id:
        query = query.filter(Booking.farmer_id == farmer_id)
    if owner_id:
        # Join with Equipment to filter bookings by owner of the machinery
        query = query.join(Equipment).filter(Equipment.owner_id == owner_id)
    if status:
        query = query.filter(Booking.status == status)
        
    return query.order_by(Booking.created_at.desc()).all()

def check_equipment_overlap(db: Session, equipment_id: UUID, start_date: date, end_date: date) -> bool:
    """Check if the equipment already has an approved booking overlapping with the requested dates."""
    overlap_exists = db.query(Booking).filter(
        Booking.equipment_id == equipment_id,
        Booking.status == "approved",
        Booking.start_date <= end_date,
        Booking.end_date >= start_date
    ).first() is not None
    return overlap_exists

def create_booking(db: Session, booking_in: BookingCreate, farmer_id: UUID) -> Booking:
    """Create a new booking and calculate total price."""
    # Fetch equipment to get price_per_day
    equipment = db.query(Equipment).filter(Equipment.id == booking_in.equipment_id).first()
    if not equipment:
        raise ValueError("Equipment not found")
        
    # Calculate price
    total = calculate_booking_price(booking_in.start_date, booking_in.end_date, equipment.price_per_day)
    
    db_booking = Booking(
        farmer_id=farmer_id,
        equipment_id=booking_in.equipment_id,
        start_date=booking_in.start_date,
        end_date=booking_in.end_date,
        total_price=total,
        status="pending"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def update_booking_status(db: Session, db_booking: Booking, status: str) -> Booking:
    """Update status of a booking."""
    db_booking.status = status
    db.commit()
    db.refresh(db_booking)
    return db_booking
