from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.models import Customer
from products.models import Product

from .models import Cart, CartItem
from .serializers import CartSerializer


class CartAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        customer = get_object_or_404(
            Customer,
            user=request.user
        )

        cart, created = Cart.objects.get_or_create(
            customer=customer
        )

        serializer = CartSerializer(cart)

        return Response(serializer.data)


class AddToCartAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        customer = get_object_or_404(
            Customer,
            user=request.user
        )

        cart, created = Cart.objects.get_or_create(
            customer=customer
        )

        product_id = request.data.get("product_id")

        quantity = int(request.data.get("quantity", 1))

        product = get_object_or_404(
            Product,
            id=product_id
        )

        if quantity <= 0:

            return Response(
                {
                    "message": "Quantity must be greater than zero."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity > product.stock:

            return Response(
                {
                    "message": "Insufficient stock."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item, created = CartItem.objects.get_or_create(

            cart=cart,

            product=product,

            defaults={
                "quantity": quantity
            }

        )

        if not created:

            new_quantity = cart_item.quantity + quantity

            if new_quantity > product.stock:

                return Response(
                    {
                        "message": "Insufficient stock."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            cart_item.quantity = new_quantity

            cart_item.save()

        serializer = CartSerializer(cart)

        return Response(

            {
                "message": "Product added to cart.",
                "cart": serializer.data
            },

            status=status.HTTP_200_OK

        )


class UpdateCartAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request):

        customer = get_object_or_404(
            Customer,
            user=request.user
        )

        cart = get_object_or_404(
            Cart,
            customer=customer
        )

        product_id = request.data.get("product_id")

        quantity = int(request.data.get("quantity"))

        cart_item = get_object_or_404(

            CartItem,

            cart=cart,

            product_id=product_id

        )

        if quantity <= 0:

            cart_item.delete()

        else:

            if quantity > cart_item.product.stock:

                return Response(

                    {
                        "message": "Insufficient stock."
                    },

                    status=status.HTTP_400_BAD_REQUEST

                )

            cart_item.quantity = quantity

            cart_item.save()

        serializer = CartSerializer(cart)

        return Response(

            {
                "message": "Cart updated successfully.",
                "cart": serializer.data
            }

        )


class RemoveCartItemAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):

        customer = get_object_or_404(
            Customer,
            user=request.user
        )

        cart = get_object_or_404(
            Cart,
            customer=customer
        )

        cart_item = get_object_or_404(

            CartItem,

            cart=cart,

            product_id=product_id

        )

        cart_item.delete()

        serializer = CartSerializer(cart)

        return Response(

            {
                "message": "Product removed from cart.",
                "cart": serializer.data
            }

        )