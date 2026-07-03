from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import date
from ..database import get_db
from ..schemas.booking import BookingCreate, BookingResponse, BookingStatusUpdate
from ..services import booking_service, email_service
from ..dependencies import get_current_user, get_farmer, get_farmer_or_owner
from ..models.user import User
from ..models.equipment import Equipment

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.get("", response_model=List[BookingResponse])
def get_user_bookings(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List bookings contextually:
    - Farmers see bookings they made.
    - Owners see bookings made on their equipment.
    - Admins see all bookings.
    """
    if current_user.role == "admin":
        return booking_service.list_bookings(db, status=status)
    elif current_user.role == "owner":
        return booking_service.list_bookings(db, owner_id=current_user.id, status=status)
    else:
        return booking_service.list_bookings(db, farmer_id=current_user.id, status=status)

@router.get("/{id}", response_model=BookingResponse)
def get_booking_details(
    id: UUID, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Get details of a specific booking. Must be the associated farmer, equipment owner, or an admin."""
    booking = booking_service.get_booking_by_id(db, id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found."
        )
        
    # Check authorization: current user must be owner of the machinery, the farmer who booked it, or an admin
    if (booking.farmer_id != current_user.id and 
        booking.equipment.owner_id != current_user.id and 
        current_user.role != "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this booking."
        )
        
    return booking

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def request_booking(
    booking_in: BookingCreate,
    current_user: User = Depends(get_farmer),
    db: Session = Depends(get_db)
):
    """Submit a booking request for an equipment. Farmers only."""
    # Validate dates
    if booking_in.start_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date cannot be in the past."
        )
    if booking_in.start_date > booking_in.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date must be before or equal to end_date."
        )
        
    # Check equipment exists and is available
    equipment = db.query(Equipment).filter(Equipment.id == booking_in.equipment_id).first()
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment listing not found."
        )
    if not equipment.is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Equipment is currently marked as unavailable."
        )
        
    # Check for scheduling conflicts (approved bookings)
    if booking_service.check_equipment_overlap(db, booking_in.equipment_id, booking_in.start_date, booking_in.end_date):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The equipment is already booked for the selected dates."
        )
        
    try:
        booking = booking_service.create_booking(db, booking_in, current_user.id)
        
        # Send mock email to equipment owner
        owner = equipment.owner
        email_service.send_booking_request_email(
            owner_email=owner.email,
            owner_name=owner.name,
            equipment_name=equipment.name,
            farmer_name=current_user.name
        )
        
        return booking
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{id}/status", response_model=BookingResponse)
def update_booking_status(
    id: UUID,
    status_update: BookingStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update booking status:
    - Owners can approve/reject pending bookings on their equipment.
    - Farmers can cancel their bookings.
    - Admins can change status to any value.
    """
    booking = booking_service.get_booking_by_id(db, id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found."
        )
        
    new_status = status_update.status
    
    # Auth logic based on role and action
    if current_user.role == "admin":
        pass # Admin can do anything
    elif current_user.role == "owner":
        # Owners can only approve/reject bookings on their own equipment
        if booking.equipment.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not own the equipment for this booking."
            )
        if new_status not in ["approved", "rejected"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Owners can only update status to 'approved' or 'rejected'."
            )
    elif current_user.role == "farmer":
        # Farmers can only cancel their own bookings
        if booking.farmer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You did not make this booking."
            )
        if new_status != "cancelled":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Farmers can only update status to 'cancelled'."
            )
            
    updated_booking = booking_service.update_booking_status(db, booking, new_status)
    
    # Send mock email notifications
    if new_status in ["approved", "rejected"]:
        email_service.send_booking_status_update_email(
            farmer_email=booking.farmer.email,
            farmer_name=booking.farmer.name,
            equipment_name=booking.equipment.name,
            status=new_status
        )
    elif new_status == "cancelled":
        email_service.send_booking_status_update_email(
            farmer_email=booking.equipment.owner.email,
            farmer_name=booking.equipment.owner.name,
            equipment_name=booking.equipment.name,
            status=f"cancelled by farmer ({booking.farmer.name})"
        )
        
    return updated_booking
