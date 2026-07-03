def send_email_notification(to_email: str, subject: str, body: str) -> bool:
    """
    Mock function to simulate sending emails.
    In development, this outputs notifications to the server log.
    """
    print("--------------------------------------------------")
    print(f"SENDING EMAIL TO: {to_email}")
    print(f"SUBJECT: {subject}")
    print(f"BODY:\n{body}")
    print("--------------------------------------------------")
    return True

def send_booking_request_email(owner_email: str, owner_name: str, equipment_name: str, farmer_name: str):
    """Notify equipment owner about a new booking request."""
    subject = "AgriRent Pro - New Booking Request received!"
    body = (
        f"Hello {owner_name},\n\n"
        f"You have received a new booking request from {farmer_name} "
        f"for your equipment: {equipment_name}.\n\n"
        f"Please log in to your AgriRent Pro dashboard to review and approve/reject the booking."
    )
    return send_email_notification(owner_email, subject, body)

def send_booking_status_update_email(farmer_email: str, farmer_name: str, equipment_name: str, status: str):
    """Notify farmer about their booking status update (Approved/Rejected/Cancelled)."""
    subject = f"AgriRent Pro - Booking status updated: {status.upper()}"
    body = (
        f"Hello {farmer_name},\n\n"
        f"The status of your booking request for '{equipment_name}' has been updated to: {status.upper()}.\n\n"
        f"Thank you for using AgriRent Pro!"
    )
    return send_email_notification(farmer_email, subject, body)
