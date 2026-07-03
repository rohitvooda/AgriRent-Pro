from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal
from uuid import UUID
from ..database import get_db
from ..schemas.equipment import EquipmentCreate, EquipmentUpdate, EquipmentResponse
from ..services import equipment_service
from ..dependencies import get_current_user, get_owner
from ..models.user import User
from ..utils.cloudinary import upload_image_to_cloudinary

router = APIRouter(prefix="/equipment", tags=["equipment"])

@router.get("", response_model=List[EquipmentResponse])
def get_all_equipment(
    category: Optional[str] = None,
    location: Optional[str] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    owner_id: Optional[UUID] = None,
    is_available: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """List and filter agricultural equipment listings."""
    return equipment_service.list_equipment(
        db, category, location, min_price, max_price, owner_id, is_available
    )

@router.get("/{id}", response_model=EquipmentResponse)
def get_equipment_detail(id: UUID, db: Session = Depends(get_db)):
    """Fetch details of a single equipment listing."""
    equipment = equipment_service.get_equipment_by_id(db, id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment listing not found."
        )
    return equipment

@router.post("", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED)
def create_new_equipment(
    equipment_in: EquipmentCreate,
    current_user: User = Depends(get_owner),
    db: Session = Depends(get_db)
):
    """Add a new equipment listing. Owners only."""
    return equipment_service.create_equipment(db, equipment_in, current_user.id)

@router.put("/{id}", response_model=EquipmentResponse)
def update_equipment_listing(
    id: UUID,
    equipment_in: EquipmentUpdate,
    current_user: User = Depends(get_owner),
    db: Session = Depends(get_db)
):
    """Update an existing equipment listing. Owners can only edit their own listings."""
    equipment = equipment_service.get_equipment_by_id(db, id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment listing not found."
        )
    if equipment.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit this listing."
        )
    return equipment_service.update_equipment(db, equipment, equipment_in)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_equipment_listing(
    id: UUID,
    current_user: User = Depends(get_owner),
    db: Session = Depends(get_db)
):
    """Delete an equipment listing. Owners can only delete their own listings."""
    equipment = equipment_service.get_equipment_by_id(db, id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment listing not found."
        )
    if equipment.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this listing."
        )
    equipment_service.delete_equipment(db, equipment)
    return None

@router.post("/{id}/upload-image", response_model=EquipmentResponse)
async def upload_equipment_image(
    id: UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_owner),
    db: Session = Depends(get_db)
):
    """Upload an image for an equipment listing using Cloudinary."""
    equipment = equipment_service.get_equipment_by_id(db, id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment listing not found."
        )
    if equipment.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to edit this listing."
        )
        
    # Read file content
    contents = await file.read()
    image_url = upload_image_to_cloudinary(contents)
    
    # Update image URL in DB
    updated_equipment = equipment_service.update_equipment(
        db, equipment, EquipmentUpdate(image_url=image_url)
    )
    return updated_equipment
