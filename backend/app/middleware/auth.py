import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class AuditLogMiddleware(BaseHTTPMiddleware):
    """
    Middleware that records execution time and basic request headers
    for security and performance audits.
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Process the request
        response = await call_next(request)
        
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        # Log response status for API monitoring
        # (Could log to standard library logger in production)
        print(f"API Audit: {request.method} {request.url.path} - Status: {response.status_code} - Took {process_time:.4f}s")
        
        return response
