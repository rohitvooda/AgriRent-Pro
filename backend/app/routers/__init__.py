from .auth import router as auth_router
from .users import router as users_router
from .equipment import router as equipment_router
from .bookings import router as bookings_router
from .payments import router as payments_router
from .reviews import router as reviews_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "users_router",
    "equipment_router",
    "bookings_router",
    "payments_router",
    "reviews_router",
    "admin_router"
]
