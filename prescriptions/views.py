from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import (
    Prescription,
    PrescriptionMedicine
)

from .serializers import (
    PrescriptionSerializer
)

from .services.ocr_service import (
    extract_prescription_text
)

from .services.ai_service import (
    analyze_prescription
)

from .services.matching_service import (
    find_matching_products
)


class PrescriptionUploadAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        uploaded_file = request.FILES.get(
            "prescription_file"
        )

        if not uploaded_file:

            return Response(
                {
                    "error":
                    "Prescription file is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        allowed_extensions = (
            ".pdf",
            ".jpg",
            ".jpeg",
            ".png"
        )

        if not uploaded_file.name.lower().endswith(
            allowed_extensions
        ):

            return Response(
                {
                    "error":
                    "Only PDF, JPG, JPEG and PNG files are allowed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # 10 MB
        if uploaded_file.size > 10 * 1024 * 1024:

            return Response(
                {
                    "error":
                    "Maximum file size is 10 MB."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        prescription = Prescription.objects.create(

            customer=request.user,

            prescription_file=uploaded_file,

            status="Processing"
        )

        try:

            # =========================
            # STEP 1 - OCR
            # =========================

            uploaded_file.seek(0)

            extracted_text = (
                extract_prescription_text(
                    uploaded_file
                )
            )

            if not extracted_text:

                prescription.status = "NeedsReview"

                prescription.extracted_text = ""

                prescription.save()

                return Response(
                    {
                        "message":
                        "Prescription uploaded, but no readable text was detected.",

                        "prescription_id":
                        prescription.id
                    },
                    status=status.HTTP_200_OK
                )

            prescription.extracted_text = (
                extracted_text
            )

            prescription.save()

            # =========================
            # STEP 2 - AI
            # =========================

            ai_result = analyze_prescription(
                extracted_text
            )

            prescription.ai_result = ai_result

            prescription.save()

            # =========================
            # STEP 3 - PRODUCT MATCHING
            # =========================

            medicines = ai_result.get(
                "medicines",
                []
            )

            for medicine_data in medicines:

                matches = find_matching_products(
                    medicine_data
                )

                best_match = None

                if matches:

                    best_match = matches[0]

                prescription_medicine = (
                    PrescriptionMedicine.objects.create(

                        prescription=prescription,

                        medicine_name=
                            medicine_data.get(
                                "name",
                                ""
                            ),

                        active_ingredient=
                            medicine_data.get(
                                "active_ingredient",
                                ""
                            ),

                        strength=
                            medicine_data.get(
                                "strength",
                                ""
                            ),

                        dosage=
                            medicine_data.get(
                                "dosage",
                                ""
                            ),

                        frequency=
                            medicine_data.get(
                                "frequency",
                                ""
                            ),

                        duration=
                            medicine_data.get(
                                "duration",
                                ""
                            ),

                        pet_type=
                            ai_result.get(
                                "pet_type",
                                ""
                            )
                    )
                )

                if best_match:

                    prescription_medicine.matched_product = (
                        best_match["product"]
                    )

                    prescription_medicine.match_score = (
                        best_match["score"]
                    )

                    prescription_medicine.is_matched = True

                    prescription_medicine.save()

            # =========================
            # STEP 4 - COMPLETE
            # =========================

            prescription.status = "Analyzed"

            prescription.analyzed_at = (
                timezone.now()
            )

            prescription.save()

            return Response(
                {
                    "message":
                    "Prescription analyzed successfully.",

                    "prescription":
                    PrescriptionSerializer(
                        prescription,
                        context={
                            "request": request
                        }
                    ).data
                },
                status=status.HTTP_201_CREATED
            )



        except Exception as e:

            prescription.status = "Failed"

            prescription.save()

            return Response(
                {
                    "error":
                    "Prescription analysis failed.",

                    "details":
                    str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )