from datetime import date
from decimal import Decimal

def calculate_booking_price(start_date: date, end_date: date, price_per_day: Decimal) -> Decimal:
    """Calculate the total booking price based on start and end dates."""
    duration_days = (end_date - start_date).days + 1
    if duration_days <= 0:
        return Decimal("0.00")
    return Decimal(duration_days) * Decimal(str(price_per_day))
