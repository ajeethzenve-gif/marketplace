from django.urls import path
from .views import ApprovedDoctorListView, BookDoctorAppointmentView

urlpatterns = [
    path("", ApprovedDoctorListView.as_view(), name="approved-doctors-list"),
    path("book/", BookDoctorAppointmentView.as_view(), name="book-doctor-appointment"),
]
