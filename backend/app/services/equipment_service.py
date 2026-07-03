from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal
from uuid import UUID
from ..models.equipment import Equipment
from ..schemas.equipment import EquipmentCreate, EquipmentUpdate

def get_equipment_by_id(db: Session, equipment_id: UUID) -> Optional[Equipment]:
    """Retrieve an equipment listing by its ID."""
    return db.query(Equipment).filter(Equipment.id == equipment_id).first()

def list_equipment(
    db: Session, 
    category: Optional[str] = None, 
    location: Optional[str] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    owner_id: Optional[UUID] = None,
    is_available: Optional[bool] = None
) -> List[Equipment]:
    """List and filter agricultural equipment listings."""
    query = db.query(Equipment)
    
    if category:
        query = query.filter(Equipment.category.ilike(f"%{category}%"))
    if location:
        query = query.filter(Equipment.location.ilike(f"%{location}%"))
    if min_price is not None:
        query = query.filter(Equipment.price_per_day >= min_price)
    if max_price is not None:
        query = query.filter(Equipment.price_per_day <= max_price)
    if owner_id:
        query = query.filter(Equipment.owner_id == owner_id)
    if is_available is not None:
        query = query.filter(Equipment.is_available == is_available)
        
    return query.all()

def create_equipment(db: Session, equipment_in: EquipmentCreate, owner_id: UUID) -> Equipment:
    """Create a new equipment listing owned by the specified user ID."""
    db_equipment = Equipment(
        owner_id=owner_id,
        name=equipment_in.name,
        category=equipment_in.category,
        description=equipment_in.description,
        price_per_day=equipment_in.price_per_day,
        location=equipment_in.location,
        image_url=equipment_in.image_url,
        is_available=equipment_in.is_available
    )
    db.add(db_equipment)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

def update_equipment(db: Session, db_equipment: Equipment, equipment_in: EquipmentUpdate) -> Equipment:
    """Update an existing equipment listing."""
    update_data = equipment_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_equipment, field, value)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

def delete_equipment(db: Session, db_equipment: Equipment) -> None:
    """Delete an equipment listing from the database."""
    db.delete(db_equipment)
    db.commit()
