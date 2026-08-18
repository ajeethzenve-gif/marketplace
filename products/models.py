from django.db import models


class Category(models.Model):

    category_name = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    image = models.ImageField(
        upload_to="categories/",
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
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.category_name


class Brand(models.Model):

    brand_name = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    image = models.ImageField(
        upload_to="brands/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        verbose_name = "Brand"
        verbose_name_plural = "Brands"

    def __str__(self):
        return self.brand_name

class Product(models.Model):

    PET_TYPES = [
        ("Dog", "Dog"),
        ("Cat", "Cat"),
        ("Bird", "Bird"),
        ("Rabbit", "Rabbit"),
        ("Fish", "Fish"),
    ]

    PRODUCT_TYPE_CHOICES = [
        ("Medicine", "Medicine"),
        ("Supplement", "Supplement"),
        ("Food", "Food"),
        ("Treat", "Treats"),
        ("Grooming", "Grooming"),
        ("Hygiene", "Hygiene"),
        ("FleaTick", "Flea & Tick Control"),
        ("Deworming", "Deworming"),
        ("DentalCare", "Dental Care"),
        ("SkinCare", "Skin Care"),
        ("JointCare", "Joint & Bone Care"),
        ("Vitamins", "Vitamins"),
        ("Accessories", "Pet Accessories"),
        ("Toys", "Toys"),
        ("Beds", "Beds & Furniture"),
        ("Leashes", "Leashes & Collars"),
        ("Clothing", "Pet Clothing"),
        ("Feeding", "Feeding Supplies"),
        ("Aquarium", "Aquarium Supplies"),
        ("BirdCare", "Bird Care"),
        ("FarmSupplies", "Farm Supplies"),
        ("VetEquipment", "Veterinary Equipment"),
        ("Other", "Other"),
    ]

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products"
    )

    brand = models.ForeignKey(
        Brand,
        on_delete=models.CASCADE,
        related_name="products"
    )

    product_name = models.CharField(
        max_length=200
    )

    description = models.TextField()

    sku = models.CharField(
        max_length=50,
        unique=True
    )

    pet_type = models.CharField(
        max_length=20,
        choices=PET_TYPES
    )

    product_type = models.CharField(
        max_length=30,
        choices=PRODUCT_TYPE_CHOICES,
        default="Other"
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    weight = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )

    is_available = models.BooleanField(
        default=True
    )

    image = models.ImageField(
        upload_to="products/",
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
        ordering = ["product_name"]

    def __str__(self):
        return self.product_name


class ProductImage(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="products/"
    )

    is_primary = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        verbose_name = "Product Image"
        verbose_name_plural = "Product Images"

    def __str__(self):
        return f"{self.product.product_name} Image"


class Medicine(models.Model):

    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name="medicine"
    )

    active_ingredient = models.CharField(
        max_length=255,
        blank=True
    )

    dosage = models.CharField(
        max_length=255,
        blank=True
    )

    dosage_form = models.CharField(
        max_length=100,
        blank=True
    )

    prescription_required = models.BooleanField(
        default=False
    )

    manufacturer = models.CharField(
        max_length=200,
        blank=True
    )

    batch_number = models.CharField(
        max_length=100,
        blank=True
    )

    expiry_date = models.DateField(
        null=True,
        blank=True
    )

    storage_instructions = models.TextField(
        blank=True
    )

    warnings = models.TextField(
        blank=True
    )

    def __str__(self):
        return self.product.product_name


class Supplement(models.Model):

    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name="supplement"
    )

    ingredients = models.TextField(
        blank=True
    )

    dosage = models.CharField(
        max_length=255,
        blank=True
    )

    form = models.CharField(
        max_length=100,
        blank=True
    )

    flavor = models.CharField(
        max_length=100,
        blank=True
    )

    age_group = models.CharField(
        max_length=100,
        blank=True
    )

    weight_range = models.CharField(
        max_length=100,
        blank=True
    )

    manufacturer = models.CharField(
        max_length=200,
        blank=True
    )

    batch_number = models.CharField(
        max_length=100,
        blank=True
    )

    expiry_date = models.DateField(
        null=True,
        blank=True
    )

    storage_instructions = models.TextField(
        blank=True
    )

    warnings = models.TextField(
        blank=True
    )

    def __str__(self):
        return self.product.product_name


