from django.urls import path
from .views import (
    ApprovedDoctorListView,
    BookDoctorAppointmentView,
    DoctorAppointmentsListView,
    UpdateAppointmentStatusView,
)

urlpatterns = [
    path("", ApprovedDoctorListView.as_view(), name="approved-doctors-list"),
    path("book/", BookDoctorAppointmentView.as_view(), name="book-doctor-appointment"),
    path("appointments/", DoctorAppointmentsListView.as_view(), name="doctor-appointments-list"),
    path("appointments/<int:appointment_id>/status/", UpdateAppointmentStatusView.as_view(), name="update-appointment-status"),
]
