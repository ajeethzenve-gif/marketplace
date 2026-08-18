from django.db import models
from django.contrib.auth.models import User,AbstractUser

class Role(models.Model):

    name = models.CharField(
        max_length=50,
        unique=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )


    def __str__(self):
        return self.name



class UserRole(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="user_role"
    )

    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name="user_roles"
    )


    def __str__(self):
        return f"{self.user.username} - {self.role.name}"

class Customer(models.Model):
    GENDER_CHOICES = (
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    )
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="customer")
    phone_number = models.CharField(max_length=15,unique=True)
    gender = models.CharField(max_length=10,choices=GENDER_CHOICES,blank=True,null=True)
    date_of_birth = models.DateField(blank=True,null=True)
    address = models.TextField(blank=True,null=True)
    city = models.CharField(max_length=100,blank=True,null=True)
    state = models.CharField(max_length=100,blank=True,null=True)
    country = models.CharField(max_length=100,default="India")
    postal_code = models.CharField(max_length=10,blank=True,null=True)
    profile_image = models.ImageField(upload_to="customers/",blank=True,null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["user__username"]
        verbose_name = "Customer"
        verbose_name_plural = "Customers"

    def __str__(self):
        return self.user.username


class CustomerAddress(models.Model):
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="addresses"
    )

    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)

    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)

    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)

    is_default = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name



class PetProfile(models.Model):

    PET_TYPE_CHOICES = [
        ("Dog", "Dog"),
        ("Cat", "Cat"),
        ("Bird", "Bird"),
        ("Rabbit", "Rabbit"),
        ("Fish", "Fish"),
        ("Other", "Other"),
    ]

    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
    ]

    customer = models.ForeignKey(
        "Customer",
        on_delete=models.CASCADE,
        related_name="pets"
    )

    pet_name = models.CharField(
        max_length=100
    )

    pet_type = models.CharField(
        max_length=20,
        choices=PET_TYPE_CHOICES,
        default="Dog"
    )

    breed = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    age = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True,
        null=True
    )

    weight = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    health_notes = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.pet_name} - {self.pet_type}"


