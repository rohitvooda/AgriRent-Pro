import uuid
from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.payment import Payment
from ..models.booking import Booking
from ..schemas.payment import PaymentCreate

def get_payment_by_id(db: Session, payment_id: uuid.UUID) -> Optional[Payment]:
    """Retrieve payment details by payment ID."""
    return db.query(Payment).filter(Payment.id == payment_id).first()

def get_payments_by_booking(db: Session, booking_id: uuid.UUID) -> List[Payment]:
    """Retrieve all payments made for a specific booking."""
    return db.query(Payment).filter(Payment.booking_id == booking_id).all()

def create_payment(db: Session, payment_in: PaymentCreate) -> Payment:
    """Record a payment transaction and update the booking state."""
    # Generate mock transaction ID if none provided
    tx_id = payment_in.transaction_id or f"TXN-{uuid.uuid4().hex[:12].upper()}"
    
    db_payment = Payment(
        booking_id=payment_in.booking_id,
        amount=payment_in.amount,
        payment_method=payment_in.payment_method,
        payment_status="completed", # Automatically mark successful in mock
        transaction_id=tx_id
    )
    
    db.add(db_payment)
    
    # Update related booking status if payment is successful
    booking = db.query(Booking).filter(Booking.id == payment_in.booking_id).first()
    if booking:
        booking.status = "approved"
        
    db.commit()
    db.refresh(db_payment)
    return db_payment
