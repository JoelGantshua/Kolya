from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def health_check(request):
    """Shallow health check - no DB"""
    return JsonResponse({
        "status": "healthy",
        "message": "Kolya API is running (shallow check)"
    })

def db_check(request):
    """Deep health check - with DB probe"""
    from django.db import connection
    import time
    start_time = time.time()
    try:
        connection.ensure_connection()
        return JsonResponse({
            "status": "healthy",
            "database": "connected",
            "time_taken": f"{time.time() - start_time:.3f}s"
        })
    except Exception as e:
        import traceback
        return JsonResponse({
            "status": "unhealthy",
            "error": str(e),
            "traceback": traceback.format_exc() if settings.DEBUG else "Traceback hidden"
        }, status=500)

def root_view(request):
    """Simple root endpoint to confirm server is up"""
    return JsonResponse({
        "status": "online",
        "message": "Bienvenue sur l'API Kolya",
        "endpoints": {
            "health": "/api/v1/health/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', root_view),  # Racine
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('authentication.urls')),
    path('api/v1/dishes/', include('dishes.urls')),
    path('api/v1/gallery/', include('gallery.urls')),
    path('api/v1/orders/', include('orders.urls')),
    path('api/v1/reservations/', include('reservations.urls')),
    path('api/v1/contact/', include('contact.urls')),
    path('api/v1/health/', health_check),
    path('api/v1/health/db/', db_check),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
