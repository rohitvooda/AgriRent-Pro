import cloudinary
import cloudinary.uploader
from ..config import settings

# Configure Cloudinary if credentials are provided
if (settings.CLOUDINARY_CLOUD_NAME and 
    settings.CLOUDINARY_API_KEY and 
    settings.CLOUDINARY_API_SECRET and 
    "your_click" not in settings.CLOUDINARY_CLOUD_NAME and 
    "your_" not in settings.CLOUDINARY_CLOUD_NAME):
    
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )
    CLOUDINARY_CONFIGURED = True
else:
    CLOUDINARY_CONFIGURED = False

def upload_image_to_cloudinary(file_data, folder: str = "agrirent_equipment") -> str:
    """
    Uploads file content to Cloudinary and returns the URL.
    Falls back to a default high-quality placeholder image if Cloudinary credentials are missing.
    """
    if CLOUDINARY_CONFIGURED:
        try:
            upload_result = cloudinary.uploader.upload(file_data, folder=folder)
            return upload_result.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload failed: {e}")
    
    # High-quality default placeholder image
    return "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
