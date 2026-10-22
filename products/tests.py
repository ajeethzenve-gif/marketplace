from django.test import TestCase
from django.contrib.auth.models import User
from decimal import Decimal

from products.models import Product, Category, Brand, RecommendationFeedback
from accounts.models import Customer, PetProfile
from products.recommendation_engine import (
    ExplainableRecommendationEngine,
    parse_pet_age,
    parse_pet_weight,
)


class ExplainableRecommendationEngineTests(TestCase):

    def setUp(self):
        # Create user & customer
        self.user = User.objects.create_user(
            username="testparent",
            email="parent@test.com",
            password="testpassword123"
        )
        self.customer = Customer.objects.create(
            user=self.user,
            phone_number="9876543210"
        )

        # Create Category & Brand
        self.category_med = Category.objects.create(
            category_name="Pet Medicines",
            description="Veterinary medicines"
        )
        self.category_food = Category.objects.create(
            category_name="Dog Food",
            description="Premium nutrition"
        )
        self.brand = Brand.objects.create(
            brand_name="Zenve Care"
        )

        # Create Products
        self.wound_spray = Product.objects.create(
            category=self.category_med,
            brand=self.brand,
            product_name="Antiseptic Healing Wound Spray",
            description="Targeted antibacterial care for skin infections, cuts, and bleeding wounds.",
            sku="SKU-WND-001",
            pet_type="Dog",
            product_type="Medicine",
            price=Decimal("450.00"),
            stock=15,
            is_available=True
        )

        self.joint_supplement = Product.objects.create(
            category=self.category_med,
            brand=self.brand,
            product_name="Senior Large Breed Glucosamine Joint Tablets",
            description="Maximum strength joint and hip mobility formula for senior large breed dogs.",
            sku="SKU-JNT-002",
            pet_type="Dog",
            product_type="JointCare",
            price=Decimal("799.00"),
            stock=20,
            is_available=True
        )

        self.puppy_kibble = Product.objects.create(
            category=self.category_food,
            brand=self.brand,
            product_name="Puppy Starter Growth Kibble 2kg",
            description="Calcium and DHA rich nutrition for puppies up to 12 months.",
            sku="SKU-PUP-003",
            pet_type="Dog",
            product_type="Food",
            price=Decimal("650.00"),
            stock=10,
            is_available=True
        )

        self.cat_treats = Product.objects.create(
            category=self.category_food,
            brand=self.brand,
            product_name="Salmon Crunchy Cat Treats",
            description="Tasty salmon bites for adult cats.",
            sku="SKU-CAT-004",
            pet_type="Cat",
            product_type="Treat",
            price=Decimal("199.00"),
            stock=25,
            is_available=True
        )

        # Create Pets
        self.pet_injured = PetProfile.objects.create(
            customer=self.customer,
            pet_name="Bruno",
            pet_type="Dog",
            breed="German Shepherd",
            age="7",
            weight="34 kg",
            health_notes="Skin infection with minor bleeding on paw"
        )

        self.pet_puppy = PetProfile.objects.create(
            customer=self.customer,
            pet_name="Milo",
            pet_type="Dog",
            breed="Golden Retriever",
            age="6 months",
            weight="8 kg",
            health_notes="Healthy and energetic"
        )

    def test_age_and_weight_parsers(self):
        age_years, stage = parse_pet_age("6 months")
        self.assertEqual(stage, "Puppy/Kitten")
        self.assertAlmostEqual(age_years, 0.5)

        age_years_senior, stage_senior = parse_pet_age("8 years")
        self.assertEqual(stage_senior, "Senior")
        self.assertEqual(age_years_senior, 8.0)

        weight_kg, size = parse_pet_weight("34 kg")
        self.assertEqual(weight_kg, 34.0)
        self.assertEqual(size, "Large (>25kg)")

    def test_health_notes_explainability_matching(self):
        recs = ExplainableRecommendationEngine.get_pet_recommendations(
            pet=self.pet_injured,
            customer=self.customer,
            limit=5
        )
        self.assertTrue(len(recs) > 0)
        top_rec = recs[0]

        # Top product should address infection & bleeding
        self.assertEqual(top_rec["product"].id, self.wound_spray.id)
        rec_data = top_rec["recommendation"]

        # Check explainability schema
        self.assertGreaterEqual(rec_data["match_score"], 85)
        self.assertIn("infection", rec_data["primary_reason"].lower())
        self.assertTrue(len(rec_data["factor_breakdown"]) == 4)
        self.assertTrue(any(b["type"] == "health" for b in rec_data["badges"]))

    def test_life_stage_recommendations(self):
        recs = ExplainableRecommendationEngine.get_pet_recommendations(
            pet=self.pet_puppy,
            customer=self.customer,
            limit=5
        )
        product_names = [r["product"].product_name for r in recs]
        self.assertIn(self.puppy_kibble.product_name, product_names)

        # Cross species products (cat treats) should NOT be recommended for a dog
        self.assertNotIn(self.cat_treats.product_name, product_names)

    def test_feedback_exclusion(self):
        # Initial recommendation includes wound spray
        recs_before = ExplainableRecommendationEngine.get_pet_recommendations(
            pet=self.pet_injured,
            customer=self.customer,
            limit=5
        )
        self.assertTrue(any(r["product"].id == self.wound_spray.id for r in recs_before))

        # User provides negative feedback
        RecommendationFeedback.objects.create(
            customer=self.customer,
            product=self.wound_spray,
            pet=self.pet_injured,
            is_helpful=False,
            feedback_reason="already_bought"
        )

        # Recommendation after feedback should exclude the unhelpful item
        recs_after = ExplainableRecommendationEngine.get_pet_recommendations(
            pet=self.pet_injured,
            customer=self.customer,
            limit=5
        )
        self.assertFalse(any(r["product"].id == self.wound_spray.id for r in recs_after))
