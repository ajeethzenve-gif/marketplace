from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from accounts.models import Customer
from products.models import Product

from .models import Wishlist
from .serializers import WishlistSerializer



class WishlistAPIView(APIView):

    permission_classes = [IsAuthenticated]


    # GET USER WISHLIST
    def get(self, request):

        customer = get_object_or_404(
            Customer,
            user=request.user
        )


        wishlist = Wishlist.objects.filter(
            customer=customer
        )


        serializer = WishlistSerializer(
            wishlist,
            many=True,
            context={
                "request": request
            }
        )


        return Response(
            serializer.data
        )



    # ADD PRODUCT TO WISHLIST
    def post(self, request):

        customer = get_object_or_404(
            Customer,
            user=request.user
        )


        product_id = request.data.get("product_id")


        product = get_object_or_404(
            Product,
            id=product_id
        )


        Wishlist.objects.get_or_create(

            customer=customer,

            product=product

        )


        return Response(
            {
                "message":"Added to wishlist"
            },
            status=status.HTTP_201_CREATED
        )



    # REMOVE PRODUCT
    def delete(self, request, product_id):

        customer = get_object_or_404(
            Customer,
            user=request.user
        )


        Wishlist.objects.filter(

            customer=customer,

            product_id=product_id

        ).delete()



        return Response(
            {
                "message":"Removed from wishlist"
            }
        )





class ToggleWishlistAPIView(APIView):

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



        wishlist_item = Wishlist.objects.filter(

            customer=customer,

            product=product

        ).first()



        # REMOVE
        if wishlist_item:


            wishlist_item.delete()


            return Response(
                {

                    "in_wishlist":False,

                    "message":"Removed from wishlist"

                }
            )



        # ADD

        Wishlist.objects.create(

            customer=customer,

            product=product

        )


        return Response(
            {

                "in_wishlist":True,

                "message":"Added to wishlist"

            }
        )





class RemoveWishlistAPIView(APIView):

    permission_classes = [IsAuthenticated]


    def delete(self, request, product_id):


        customer = get_object_or_404(

            Customer,

            user=request.user

        )


        wishlist = Wishlist.objects.filter(

            customer=customer,

            product_id=product_id

        )



        if wishlist.exists():


            wishlist.delete()


            return Response(
                {
                    "message":"Removed from wishlist"
                }
            )



        return Response(
            {
                "message":"Product not found in wishlist"
            },
            status=status.HTTP_404_NOT_FOUND
        )