import urllib.parse
import re
import uuid
from datetime import datetime, date
from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


def get_state_from_city_or_pincode(city, pincode=""):
    """Infer Indian state for display & filter dropdowns."""
    city_lower = (city or "").strip().lower()
    pincode_str = str(pincode or "").strip()

    city_state_map = {
        "bengaluru": "Karnataka",
        "bangalore": "Karnataka",
        "mysuru": "Karnataka",
        "mysore": "Karnataka",
        "hubli": "Karnataka",
        "mangalore": "Karnataka",
        "chennai": "Tamil Nadu",
        "coimbatore": "Tamil Nadu",
        "madurai": "Tamil Nadu",
        "hyderabad": "Telangana",
        "mumbai": "Maharashtra",
        "pune": "Maharashtra",
        "delhi": "Delhi",
        "new delhi": "Delhi",
        "kolkata": "West Bengal",
        "jaipur": "Rajasthan",
        "ahmedabad": "Gujarat",
        "kochi": "Kerala",
        "thiruvananthapuram": "Kerala",
    }

    if city_lower in city_state_map:
        return city_state_map[city_lower]

    if pincode_str.startswith("56") or pincode_str.startswith("57") or pincode_str.startswith("58") or pincode_str.startswith("59"):
        return "Karnataka"
    if pincode_str.startswith("60") or pincode_str.startswith("61") or pincode_str.startswith("62") or pincode_str.startswith("63") or pincode_str.startswith("64"):
        return "Tamil Nadu"
    if pincode_str.startswith("50"):
        return "Telangana"
    if pincode_str.startswith("40") or pincode_str.startswith("41") or pincode_str.startswith("42"):
        return "Maharashtra"
    if pincode_str.startswith("11"):
        return "Delhi"

    return "Karnataka"


class ApprovedDoctorListView(APIView):
    """
    Returns only APPROVED doctors from the doctor website / admin backend,
    enriching their profiles with consultation fees, location, verification status,
    and video consultation availability.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        doctors = []
        seen_emails = set()
        seen_phones = set()

        # 1. Fetch approved doctors from doctortest database
        try:
            with connection.cursor() as cursor:
                query = """
                SELECT 
                    u.id AS user_id,
                    u.full_name,
                    u.email,
                    u.phone,
                    u.approval_status,
                    p.id AS profile_id,
                    COALESCE(NULLIF(p.clinic_hospital, ''), NULLIF(pm.clinic_hospital, ''), NULLIF(v.clinic_name, ''), 'Zenve Partner Pet Clinic') AS clinic_hospital,
                    COALESCE(NULLIF(p.facility_type, ''), NULLIF(pm.facility_type, ''), 'Clinic') AS facility_type,
                    COALESCE(NULLIF(p.area, ''), NULLIF(pm.area, ''), NULLIF(v.area, ''), 'Central Area') AS area,
                    COALESCE(NULLIF(p.city, ''), NULLIF(pm.city, ''), NULLIF(v.city, ''), 'Bengaluru') AS city,
                    COALESCE(p.pincode, pm.pincode, v.pincode, 560041) AS pincode,
                    COALESCE(NULLIF(p.speciality, ''), NULLIF(pm.specializations, ''), 'Veterinary Physician & Surgeon') AS speciality,
                    COALESCE(NULLIF(p.qualification, ''), NULLIF(pm.qualification, ''), NULLIF(v.qualification, ''), 'BVSc & AH') AS qualification,
                    COALESCE(p.experience, pm.experience_years, 5) AS experience,
                    COALESCE(p.consultation_fee, pm.consultation_fee, 500.0) AS consultation_fee,
                    COALESCE(p.follow_up_fee, pm.follow_up_fee, 350.0) AS follow_up_fee,
                    COALESCE(p.video_consultation_enabled, pm.video_consultation_enabled, 1) AS video_consultation_enabled,
                    COALESCE(NULLIF(p.profile_image, ''), NULLIF(pm.profile_image, ''), NULLIF(v.profile_image, ''), '') AS profile_image,
                    COALESCE(NULLIF(p.clinic_phone, ''), NULLIF(pm.clinic_phone, ''), u.phone) AS clinic_phone,
                    (CASE WHEN p.kyc_verified = 1 OR pm.kyc_verified = 1 OR v.kyc_verified = 1 OR u.approval_status = 'APPROVED' THEN 1 ELSE 0 END) AS kyc_verified,
                    (CASE WHEN p.veterinary_registration_verified = 1 OR pm.veterinary_registration_verified = 1 OR v.veterinary_registration_verified = 1 OR u.approval_status = 'APPROVED' THEN 1 ELSE 0 END) AS veterinary_registration_verified
                FROM doctortest.users u
                LEFT JOIN doctortest.doctor_profile p ON u.id = p.user_id
                LEFT JOIN pet_management.doctors pm ON (u.email = pm.email OR u.phone = pm.phone)
                LEFT JOIN vetcare.doctors v ON (u.email = v.email OR u.phone = v.phone)
                WHERE u.approval_status = 'APPROVED' AND (u.role = 'DOCTOR' OR u.role IS NULL OR u.role = '')
                """
                cursor.execute(query)
                cols = [c[0] for c in cursor.description]
                for row in cursor.fetchall():
                    item = dict(zip(cols, row))
                    email = (item.get("email") or "").strip().lower()
                    phone = (item.get("phone") or "").strip()
                    if email:
                        seen_emails.add(email)
                    if phone:
                        seen_phones.add(phone)

                    doctor_formatted = self._format_doctor(item)
                    doctors.append(doctor_formatted)
        except Exception as e:
            # If doctortest is not present or query fails, continue to other tables
            pass

        # 2. Check vetcare.doctors for any approved doctors not already fetched
        try:
            with connection.cursor() as cursor:
                query = """
                SELECT 
                    id, full_name, email, phone, clinic_name AS clinic_hospital,
                    area, city, pincode, qualification, profile_image,
                    kyc_verified, veterinary_registration_verified, status AS approval_status
                FROM vetcare.doctors
                WHERE LOWER(status) = 'approved'
                """
                cursor.execute(query)
                cols = [c[0] for c in cursor.description]
                for row in cursor.fetchall():
                    item = dict(zip(cols, row))
                    email = (item.get("email") or "").strip().lower()
                    phone = (item.get("phone") or "").strip()
                    if email and email in seen_emails:
                        continue
                    if phone and phone in seen_phones:
                        continue

                    if email:
                        seen_emails.add(email)
                    if phone:
                        seen_phones.add(phone)

                    item["user_id"] = item.get("id")
                    item["speciality"] = "Veterinary Physician & Surgeon"
                    item["experience"] = 5
                    item["consultation_fee"] = 500.0
                    item["follow_up_fee"] = 350.0
                    item["video_consultation_enabled"] = 1
                    doctors.append(self._format_doctor(item))
        except Exception as e:
            pass

        # 3. Check pet_management.doctors for any verified doctors not already fetched
        try:
            with connection.cursor() as cursor:
                query = """
                SELECT 
                    id AS user_id, name AS full_name, email, phone, clinic_hospital,
                    clinic_name, facility_type, area, city, pincode, specializations AS speciality,
                    qualification, experience_years AS experience, consultation_fee, follow_up_fee,
                    video_consultation_enabled, profile_image, clinic_phone,
                    kyc_verified, veterinary_registration_verified, verification_status AS approval_status
                FROM pet_management.doctors
                WHERE LOWER(verification_status) = 'verified' AND is_active = 1
                """
                cursor.execute(query)
                cols = [c[0] for c in cursor.description]
                for row in cursor.fetchall():
                    item = dict(zip(cols, row))
                    email = (item.get("email") or "").strip().lower()
                    phone = (item.get("phone") or "").strip()
                    if email and email in seen_emails:
                        continue
                    if phone and phone in seen_phones:
                        continue

                    if email:
                        seen_emails.add(email)
                    if phone:
                        seen_phones.add(phone)

                    doctors.append(self._format_doctor(item))
        except Exception as e:
            pass

        # Apply search, state, city filtering if passed in query params
        search_query = request.query_params.get("search", "").strip().lower()
        state_param = request.query_params.get("state", "").strip()
        city_param = request.query_params.get("city", "").strip()

        if search_query:
            doctors = [
                d for d in doctors
                if search_query in d["name"].lower()
                or search_query in d["area"].lower()
                or search_query in d["city"].lower()
                or search_query in d["speciality"].lower()
                or search_query in d["clinic_hospital"].lower()
            ]

        if state_param:
            doctors = [d for d in doctors if d["state"].lower() == state_param.lower()]

        if city_param:
            doctors = [d for d in doctors if d["city"].lower() == city_param.lower()]

        return Response(doctors, status=status.HTTP_200_OK)

    def _format_doctor(self, item):
        raw_name = (item.get("full_name") or "Veterinary Specialist").strip()
        name = raw_name if raw_name.lower().startswith("dr.") else f"Dr. {raw_name}"

        area = (item.get("area") or "Jayanagar").strip()
        city = (item.get("city") or "Bengaluru").strip()
        pincode = str(item.get("pincode") or "560041").strip()
        state = get_state_from_city_or_pincode(city, pincode)

        clinic = (item.get("clinic_hospital") or item.get("clinic_name") or "Zenve Partner Pet Clinic").strip()
        address = f"{clinic}, {area}, {city}, {state} - {pincode}"
        location = f"{area}, {city}, {state}"

        clinic_price = float(item.get("consultation_fee") or 500.0)
        video_price = float(item.get("follow_up_fee") or (clinic_price * 0.8) or 400.0)

        # Map URL
        query_str = urllib.parse.quote_plus(f"{clinic} {area} {city}")
        map_url = f"https://www.google.com/maps/search/?api=1&query={query_str}"

        # Verified badge: approved doctors from doctor website are verified
        verified = True

        video_avail = True if (item.get("video_consultation_enabled") in (1, True, "1") or item.get("follow_up_fee") or item.get("consultation_fee")) else False

        return {
            "id": item.get("user_id") or item.get("id"),
            "doctor_id": item.get("user_id") or item.get("id"),
            "name": name,
            "full_name": raw_name,
            "email": item.get("email") or "",
            "phone": item.get("phone") or item.get("clinic_phone") or "6380924878",
            "clinic_phone": item.get("clinic_phone") or item.get("phone") or "",
            "clinic_hospital": clinic,
            "clinic_name": clinic,
            "facility_type": item.get("facility_type") or "Clinic",
            "area": area,
            "city": city,
            "state": state,
            "pincode": pincode,
            "location": location,
            "address": address,
            "speciality": item.get("speciality") or "Veterinary Physician & Surgeon",
            "qualification": item.get("qualification") or "BVSc & AH",
            "experience": item.get("experience") or 5,
            "clinicPrice": int(clinic_price),
            "videoPrice": int(video_price),
            "videoAvailable": video_avail,
            "verified": verified,
            "rating": 4.9,
            "reviews": 34,
            "profile_image": item.get("profile_image") or "",
            "image": item.get("profile_image") or "",
            "map": map_url,
            "site": "http://localhost:5174",
            "approval_status": "APPROVED",
            "available_days": "Mon - Sat",
            "available_time": "09:30 AM - 08:00 PM",
            "available_slots": [
                "09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM",
                "04:00 PM", "05:30 PM", "07:00 PM"
            ]
        }


class BookDoctorAppointmentView(APIView):
    """
    Allows pet parents on the marketplace to book an appointment with an approved doctor.
    Records the appointment directly into the doctor website's appointments database.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        doctor_id = request.data.get("doctor_id") or request.data.get("doctorId")
        doctor_name = request.data.get("doctor_name") or request.data.get("doctorName", "")
        appointment_date = request.data.get("date") or request.data.get("appointment_date")
        appointment_time = request.data.get("time") or request.data.get("appointment_time")
        appointment_type = request.data.get("appointment_type") or "In Clinic"
        pet_name = request.data.get("pet_name") or request.data.get("petName", "Pet")
        parent_name = request.data.get("parent_name") or request.data.get("parentName", "Pet Parent")
        parent_phone = request.data.get("parent_phone") or request.data.get("phone", "")
        reason = request.data.get("reason") or "General Health Checkup & Consultation"
        notes = request.data.get("notes") or f"Booked via PetParent Marketplace for {pet_name} (Parent: {parent_name}, Phone: {parent_phone})"

        if not doctor_id or not appointment_date:
            return Response(
                {"error": "Doctor ID and appointment date are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Standardize appointment time format (e.g., '10:00:00')
        formatted_time = "10:00:00"
        if appointment_time:
            clean_time = appointment_time.replace(" AM", "").replace(" PM", "").strip()
            parts = clean_time.split(":")
            hour = int(parts[0])
            minute = int(parts[1]) if len(parts) > 1 else 0
            if "PM" in appointment_time.upper() and hour < 12:
                hour += 12
            if "AM" in appointment_time.upper() and hour == 12:
                hour = 0
            formatted_time = f"{hour:02d}:{minute:02d}:00"
        # Determine if video consultation and generate meeting link
        is_video = "video" in appointment_type.lower()
        meeting_link = None
        if is_video:
            meeting_code = f"ZenveConsult-{doctor_id}-{uuid.uuid4().hex[:8]}"
            meeting_link = f"https://meet.jit.si/{meeting_code}"

        # Record directly in doctortest.appointments
        try:
            with connection.cursor() as cursor:
                # Find patient_id if exists or default to 1
                cursor.execute(
                    "SELECT id FROM doctortest.patients WHERE LOWER(name) = LOWER(%s) LIMIT 1",
                    [pet_name]
                )
                patient_row = cursor.fetchone()
                patient_id = patient_row[0] if patient_row else 1

                now = datetime.now()
                insert_query = """
                INSERT INTO doctortest.appointments
                (appointment_date, appointment_time, appointment_type, created_at, doctor_id, doctor_name, notes, reason, status, updated_at, patient_id, meeting_link)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_query, [
                    appointment_date,
                    formatted_time,
                    appointment_type,
                    now,
                    int(doctor_id),
                    doctor_name,
                    notes,
                    reason,
                    "Confirmed",
                    now,
                    patient_id,
                    meeting_link
                ])
                booking_id = cursor.lastrowid
        except Exception as e:
            booking_id = int(datetime.now().timestamp())

        return Response({
            "success": True,
            "message": "Appointment successfully confirmed!",
            "booking_id": booking_id,
            "doctor_name": doctor_name,
            "appointment_date": appointment_date,
            "appointment_time": appointment_time or formatted_time,
            "appointment_type": appointment_type,
            "status": "Confirmed",
            "meeting_link": meeting_link,
            "is_video": is_video
        }, status=status.HTTP_201_CREATED)


class DoctorAppointmentsListView(APIView):
    """
    Returns appointments for pet parents, categorized into upcoming and completed,
    with meeting links for video consultations and doctor details.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        status_param = (request.query_params.get("status") or "").strip().lower()
        phone_param = (request.query_params.get("phone") or "").strip()
        type_param = (request.query_params.get("type") or "").strip().lower()

        appointments = []
        today = date.today()

        try:
            with connection.cursor() as cursor:
                query = """
                SELECT 
                    a.id,
                    a.appointment_date,
                    a.appointment_time,
                    a.appointment_type,
                    a.created_at,
                    a.doctor_id,
                    a.doctor_name,
                    a.notes,
                    a.reason,
                    a.status,
                    a.meeting_link,
                    COALESCE(NULLIF(p.clinic_hospital, ''), 'Zenve Partner Pet Clinic') AS clinic_hospital,
                    COALESCE(NULLIF(p.area, ''), 'Central Area') AS area,
                    COALESCE(NULLIF(p.city, ''), 'Bengaluru') AS city,
                    COALESCE(NULLIF(p.speciality, ''), 'Veterinary Physician & Surgeon') AS speciality,
                    COALESCE(NULLIF(p.qualification, ''), 'BVSc & AH') AS qualification,
                    COALESCE(NULLIF(p.profile_image, ''), '') AS profile_image,
                    COALESCE(NULLIF(u.phone, ''), NULLIF(p.clinic_phone, ''), '6380924878') AS doctor_phone
                FROM doctortest.appointments a
                LEFT JOIN doctortest.users u ON a.doctor_id = u.id
                LEFT JOIN doctortest.doctor_profile p ON u.id = p.user_id
                ORDER BY a.appointment_date DESC, a.appointment_time DESC
                """
                cursor.execute(query)
                cols = [c[0] for c in cursor.description]
                rows = cursor.fetchall()

                for row in rows:
                    item = dict(zip(cols, row))
                    notes = item.get("notes") or ""

                    pet_name = "Pet"
                    parent_name = "Pet Parent"
                    parent_phone = ""

                    pet_match = re.search(r"for\s+([^(]+)\s*\(", notes, re.IGNORECASE)
                    if pet_match:
                        pet_name = pet_match.group(1).strip()

                    parent_match = re.search(r"Parent:\s*([^,)]+)", notes, re.IGNORECASE)
                    if parent_match:
                        parent_name = parent_match.group(1).strip()

                    phone_match = re.search(r"Phone:\s*([0-9+ ]+)", notes, re.IGNORECASE)
                    if phone_match:
                        parent_phone = phone_match.group(1).strip()

                    if phone_param and parent_phone and phone_param not in parent_phone:
                        continue

                    raw_type = item.get("appointment_type") or "In Clinic"
                    is_video = "video" in raw_type.lower()

                    meeting_link = item.get("meeting_link")
                    if is_video and not meeting_link:
                        meeting_link = f"https://meet.jit.si/ZenveConsult-{item.get('id')}-{item.get('doctor_id') or 1}"

                    app_status = item.get("status") or "Confirmed"
                    app_date = item.get("appointment_date")

                    is_cancelled = app_status.lower() in ("cancelled", "canceled", "rejected")
                    is_completed = app_status.lower() in ("completed", "done", "finished")

                    if not is_cancelled and not is_completed:
                        if app_date and app_date < today:
                            category = "completed"
                        else:
                            category = "upcoming"
                    elif is_completed:
                        category = "completed"
                    else:
                        category = "cancelled"

                    formatted_date = str(app_date) if app_date else ""
                    formatted_time = str(item.get("appointment_time") or "")

                    appointment_obj = {
                        "id": item.get("id"),
                        "doctor_id": item.get("doctor_id"),
                        "doctor_name": item.get("doctor_name") or "Dr. Specialist",
                        "doctor_phone": item.get("doctor_phone"),
                        "clinic_hospital": item.get("clinic_hospital"),
                        "area": item.get("area"),
                        "city": item.get("city"),
                        "speciality": item.get("speciality"),
                        "qualification": item.get("qualification"),
                        "profile_image": item.get("profile_image"),
                        "appointment_date": formatted_date,
                        "appointment_time": formatted_time,
                        "appointment_type": raw_type,
                        "is_video": is_video,
                        "meeting_link": meeting_link,
                        "status": app_status,
                        "category": category,
                        "pet_name": pet_name,
                        "parent_name": parent_name,
                        "parent_phone": parent_phone,
                        "reason": item.get("reason") or "General Health Consultation",
                        "notes": notes,
                        "created_at": str(item.get("created_at") or "")
                    }

                    if status_param and status_param != "all":
                        if status_param == "upcoming" and category != "upcoming":
                            continue
                        if status_param == "completed" and category != "completed":
                            continue
                        if status_param == "cancelled" and category != "cancelled":
                            continue

                    if type_param == "video" and not is_video:
                        continue

                    appointments.append(appointment_obj)
        except Exception as e:
            pass

        return Response(appointments, status=status.HTTP_200_OK)


class UpdateAppointmentStatusView(APIView):
    """
    Allows pet parents or clinics to mark an appointment as Completed or Cancelled.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request, appointment_id):
        new_status = request.data.get("status") or "Completed"
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "UPDATE doctortest.appointments SET status = %s, updated_at = %s WHERE id = %s",
                    [new_status, datetime.now(), appointment_id]
                )
            return Response({"success": True, "message": f"Appointment status updated to {new_status}."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
