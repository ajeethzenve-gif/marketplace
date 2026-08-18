from django.urls import path

from .views import (
    PrescriptionUploadAPIView
)


urlpatterns = [

    path(
        "upload/",
        PrescriptionUploadAPIView.as_view(),
        name="prescription-upload"
    ),

]