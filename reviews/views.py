from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from accounts.models import Customer
from products.models import Product

from .models import Review
from .serializers import ReviewSerializer


class ProductReviewListAPIView(APIView):

    def get(self, request, product_id):

        product = get_object_or_404(

            Product,

            id=product_id

        )

        reviews = Review.objects.filter(

            product=product

        )

        serializer = ReviewSerializer(

            reviews,

            many=True

        )

        return Response(serializer.data)


class AddReviewAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        customer = get_object_or_404(

            Customer,

            user=request.user

        )

        product = get_object_or_404(

            Product,

            id=request.data.get("product_id")

        )

        rating = request.data.get("rating")

        review_text = request.data.get("review")

        review, created = Review.objects.update_or_create(

            customer=customer,

            product=product,

            defaults={

                "rating": rating,

                "review": review_text

            }

        )

        serializer = ReviewSerializer(review)

        if created:

            return Response(

                {

                    "message": "Review added successfully.",

                    "review": serializer.data

                },

                status=status.HTTP_201_CREATED

            )

        return Response(

            {

                "message": "Review updated successfully.",

                "review": serializer.data

            },

            status=status.HTTP_200_OK

        )


class UpdateReviewAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, review_id):

        customer = get_object_or_404(

            Customer,

            user=request.user

        )

        review = get_object_or_404(

            Review,

            id=review_id,

            customer=customer

        )

        serializer = ReviewSerializer(

            review,

            data=request.data,

            partial=True

        )

        if serializer.is_valid():

            serializer.save()

            return Response(

                {

                    "message": "Review updated successfully.",

                    "review": serializer.data

                }

            )

        return Response(

            serializer.errors,

            status=status.HTTP_400_BAD_REQUEST

        )


class DeleteReviewAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, review_id):

        customer = get_object_or_404(

            Customer,

            user=request.user

        )

        review = get_object_or_404(

            Review,

            id=review_id,

            customer=customer

        )

        review.delete()

        return Response(

            {

                "message": "Review deleted successfully."

            },

            status=status.HTTP_200_OK

        )