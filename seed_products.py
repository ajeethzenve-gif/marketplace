import os
import random
from decimal import Decimal
from django.conf import settings
from products.models import Category, Brand, Product, ProductImage, Medicine, Supplement

def run():
    print("Seeding categories and brands...")
    categories_data = [
        {"name": "Food & Nutrition", "desc": "Nutritious and delicious meals and treats for all pets"},
        {"name": "Healthcare & Medicine", "desc": "Veterinary medicines, treatments, and drops"},
        {"name": "Supplements & Vitamins", "desc": "Joint, skin, immunity, and digestive boosters"},
        {"name": "Grooming & Hygiene", "desc": "Shampoos, conditioners, sprays, and hygiene supplies"},
        {"name": "Veterinary Equipment", "desc": "Professional clinical tools, instruments, and kits"},
        {"name": "Accessories & Feeding", "desc": "Bowls, feeders, collars, and pet accessories"}
    ]
    
    category_map = {}
    for c_info in categories_data:
        cat, _ = Category.objects.get_or_create(
            category_name=c_info["name"],
            defaults={"description": c_info["desc"]}
        )
        category_map[c_info["name"]] = cat

    brands_data = [
        {"name": "Drools", "desc": "Premium pet food and nutrition"},
        {"name": "Pedigree", "desc": "Trusted complete nutrition for dogs"},
        {"name": "Himalaya", "desc": "Herbal animal healthcare and wellness"},
        {"name": "Royal Canin", "desc": "Breed-tailored health nutrition"},
        {"name": "PetCare Plus", "desc": "Everyday veterinary health solutions"},
        {"name": "VetLife", "desc": "Clinical diet and medical wellness"}
    ]
    
    brand_map = {}
    for b_info in brands_data:
        br, _ = Brand.objects.get_or_create(
            brand_name=b_info["name"],
            defaults={"description": b_info["desc"]}
        )
        brand_map[b_info["name"]] = br

    media_products_dir = os.path.join(settings.MEDIA_ROOT, "products")
    if not os.path.exists(media_products_dir):
        print(f"Directory {media_products_dir} not found.")
        return

    images = [f for f in os.listdir(media_products_dir) if os.path.isfile(os.path.join(media_products_dir, f))]
    print(f"Found {len(images)} images in media/products/")

    # Pre-defined mappings for recognizable filenames
    # Fallback auto-formatter for any remaining images
    seeded_count = 0
    for idx, img_name in enumerate(images, start=1):
        clean_name = os.path.splitext(img_name)[0].replace("_", " ").replace("-", " ")
        sku = f"SKU-ZENVE-{idx:04d}"
        
        # Determine category, pet type, product type, brand
        lower = img_name.lower()
        if "pedigree" in lower:
            brand = brand_map["Pedigree"]
            category = category_map["Food & Nutrition"]
            product_type = "Food"
            pet_type = "Dog"
            price = Decimal("850.00")
            name = "Pedigree Complete Nutrition Adult Dog Food"
        elif "drools" in lower:
            brand = brand_map["Drools"]
            if "shampoo" in lower:
                category = category_map["Grooming & Hygiene"]
                product_type = "Grooming"
                price = Decimal("399.00")
                name = "Drools Herbal Pet Shampoo"
            elif "supplement" in lower:
                category = category_map["Supplements & Vitamins"]
                product_type = "Supplement"
                price = Decimal("550.00")
                name = "Drools Calcium & Vitamin Supplement"
            else:
                category = category_map["Food & Nutrition"]
                product_type = "Food"
                price = Decimal("699.00")
                name = "Drools Premium Dog Nutrition"
            pet_type = "Dog"
        elif "himalaya" in lower:
            brand = brand_map["Himalaya"]
            category = category_map["Supplements & Vitamins"]
            product_type = "Supplement"
            pet_type = "Dog"
            price = Decimal("480.00")
            name = "Himalaya Healthy Pet Tonic & Supplement"
        elif "cat" in lower:
            pet_type = "Cat"
            brand = brand_map["Royal Canin"]
            if "supplement" in lower or "nutrition" in lower:
                category = category_map["Supplements & Vitamins"]
                product_type = "Supplement"
                price = Decimal("420.00")
                name = clean_name.title()
            elif "drop" in lower or "care" in lower:
                category = category_map["Healthcare & Medicine"]
                product_type = "Medicine"
                price = Decimal("290.00")
                name = clean_name.title()
            else:
                category = category_map["Food & Nutrition"]
                product_type = "Treat"
                price = Decimal("250.00")
                name = clean_name.title()
        elif "veterinary" in lower or "forceps" in lower or "scissors" in lower or "stethoscope" in lower or "thermometer" in lower or "scale" in lower or "table" in lower:
            brand = brand_map["VetLife"]
            category = category_map["Veterinary Equipment"]
            product_type = "VetEquipment"
            pet_type = "Dog"
            price = Decimal(str(random.randint(500, 3500)))
            name = clean_name.title()
        elif "supplement" in lower or "vitamin" in lower or "calcium" in lower or "omega" in lower or "probiotic" in lower or "joint" in lower or "skin" in lower:
            brand = brand_map["PetCare Plus"]
            category = category_map["Supplements & Vitamins"]
            product_type = "Supplement"
            pet_type = "Dog" if idx % 2 == 0 else "Cat"
            price = Decimal(str(random.randint(350, 890)))
            name = clean_name.title()
        elif "tablet" in lower or "drops" in lower or "spray" in lower or "wound" in lower or "infection" in lower or "allergy" in lower or "digestive" in lower:
            brand = brand_map["PetCare Plus"]
            category = category_map["Healthcare & Medicine"]
            product_type = "Medicine"
            pet_type = "Dog"
            price = Decimal(str(random.randint(220, 750)))
            name = clean_name.title()
        else:
            brand = list(brand_map.values())[idx % len(brand_map)]
            category = list(category_map.values())[idx % len(category_map)]
            product_type = "Supplement" if "powder" in lower or "feed" in lower else "Other"
            pet_type = "Dog" if idx % 3 == 0 else ("Cat" if idx % 3 == 1 else "Bird")
            price = Decimal(str(random.randint(200, 1200)))
            # If name is a random hash/code, provide a friendly name
            if len(clean_name) > 20 and not any(k in lower for k in ["care", "pet", "dog", "cat", "feed"]):
                name = f"Premium {brand.brand_name} {category.category_name} Care {idx}"
            else:
                name = clean_name.title()

        prod, created = Product.objects.get_or_create(
            sku=sku,
            defaults={
                "category": category,
                "brand": brand,
                "product_name": name,
                "description": f"High quality {name} formulated for optimal {pet_type.lower()} health and wellness. Trusted by veterinarians and pet owners across India.",
                "pet_type": pet_type,
                "product_type": product_type,
                "price": price,
                "stock": 50,
                "weight": "500g",
                "is_available": True,
                "image": f"products/{img_name}",
            }
        )
        if created:
            seeded_count += 1
            ProductImage.objects.get_or_create(
                product=prod,
                image=f"products/{img_name}",
                defaults={"is_primary": True}
            )

    print(f"Successfully seeded {seeded_count} products!")

if __name__ == "__main__":
    run()
