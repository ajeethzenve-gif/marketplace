"""
URL configuration for zenve project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.http import JsonResponse

from django.conf import settings
from django.conf.urls.static import static

def api_root(request):
    return JsonResponse({
        "status": "healthy",
        "service": "Zenve Marketplace API",
        "endpoints": {
            "products": "/api/",
            "accounts": "/api/accounts/",
            "cart": "/api/cart/",
            "orders": "/api/orders/",
            "wishlist": "/api/wishlist/",
            "reviews": "/api/reviews/",
            "coupons": "/api/coupons/",
            "prescriptions": "/api/prescriptions/",
            "payments": "/api/payments/",
            "membership": "/api/membership/",
            "wallet": "/api/wallet/",
            "admin": "/admin/",
        }
    })

urlpatterns = [
    path("", api_root, name="api-root"),
    path('admin/', admin.site.urls),
    path("api/", include("products.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("api/cart/", include("cart.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/wishlist/", include("wishlist.urls")),
    path("api/reviews/",include("reviews.urls")),
    path("api/coupons/",include("coupons.urls")),
    path("api/prescriptions/",include("prescriptions.urls")),
    path("api/payments/",include("payments.urls")),
    path("api/membership/",include("membership.urls")),
    path("api/wallet/", include("wallet.urls")),
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
