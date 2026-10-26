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
        
        # Exact mappings based on image filename
        EXACT_IMAGE_MAP = {
            "1749398866_crop_361.avif": ("Dog", "Supplement", "PetCare Plus", "Supplements & Vitamins", "Vitamina Puppy Growth & Development Formula"),
            "41qgmq3ksqL._AC_.jpg": ("Cat", "Food", "Royal Canin", "Food & Nutrition", "Whiskas Adult Tuna Flavor Cat Food 1.2kg"),
            "41RhH7IvVbL._SY300_SX300_QL70_ML2_.jpg": ("Cat", "Food", "Drools", "Food & Nutrition", "Drools Adult Ocean Fish Cat Nutrition 3kg"),
            "5160eda954fe9ff1e54888b04e597f15.jpg": ("Cat", "Toys", "PetCare Plus", "Accessories & Feeding", "Interactive USB Feline Laser Pointer Toy"),
            "61-2fshJWL._AC_.jpg": ("Dog", "Grooming", "PetCare Plus", "Grooming & Hygiene", "Gentle LED Pet Nail Clipper & Grinder"),
            "615CcfwziL._AC_SL1300_.jpg": ("Cat", "Toys", "PetCare Plus", "Accessories & Feeding", "Feather Teaser Wand Feline Interactive Toy"),
            "61DcE0Xq7CL._AC_SL1500_.jpg": ("Cat", "Accessories", "PetCare Plus", "Accessories & Feeding", "Velvet Bowtie Cat Collar with Bell"),
            "61L5LVqbyL._AC_.jpg": ("Dog", "Toys", "PetCare Plus", "Accessories & Feeding", "Textured Squeaky Dog Chew Toy"),
            "61N6d7o6LiL.jpg": ("Dog", "Food", "Drools", "Food & Nutrition", "Drools Focus Super Premium Adult Dog Food 4kg"),
            "61tlMM0CMYL._AC_SL1500_.jpg": ("Dog", "Toys", "PetCare Plus", "Accessories & Feeding", "Smart Remote Control Interactive Dog Ball Toy"),
            "61VRoVP9BGL._AC_SL1500_.jpg": ("Cat", "Feeding", "PetCare Plus", "Accessories & Feeding", "Elevated Tilted Ceramic Cat Feeding Bowls"),
            "703727.jpg": ("Dog", "Food", "Drools", "Food & Nutrition", "Purepet Real Fresh Meat Adult Dog Food 10kg"),
            "710nHoLQ4PL._AC_SL1500_.jpg": ("Universal", "VetEquipment", "VetLife", "Veterinary Equipment", "Professional Veterinary Diagnostic Otoscope Kit"),
            "710OpWdQDpS.jpg": ("Dog", "Feeding", "PetCare Plus", "Accessories & Feeding", "Premium Stainless Steel Pet Feeding Bowls"),
            "71BSLKDOeyL.jpg": ("Dog", "Toys", "PetCare Plus", "Accessories & Feeding", "Tough Rubber Dental Chew Toys for Dogs"),
            "71HRwZsM21L.jpg": ("Dog", "Feeding", "PetCare Plus", "Accessories & Feeding", "Automatic Stainless Steel Pet Water Trough"),
            "71lRgFqg95L._SL1500_.jpg": ("Dog", "Grooming", "PetCare Plus", "Grooming & Hygiene", "Complete Pet Grooming Scissors & Brush Kit"),
            "71XEDMJsdrL._AC_.jpg": ("Dog", "Beds", "PetCare Plus", "Accessories & Feeding", "Plush Donut Orthopedic Pet Bed"),
            "81GOjQGaDaL._SL1500_.jpg": ("Dog", "Accessories", "PetCare Plus", "Accessories & Feeding", "Heavy-Duty Studded Leather Dog Collar"),
            "81VEmhZ8Y7L.jpg": ("Dog", "DentalCare", "PetCare Plus", "Supplements & Vitamins", "Greenies Regular Dental Treats for Dogs"),
            "cn-11134207-7qukw-lgyg543roq5890.jpg": ("Dog", "Accessories", "PetCare Plus", "Accessories & Feeding", "Custom Engraved Glitter Paw Pet ID Tag"),
            "e057c437d4612f1e25d8f968735de734.jpg": ("Cat", "Beds", "PetCare Plus", "Accessories & Feeding", "Plush Hooded Calming Cat Bed"),
            "hdpe-rice-bags.jpg": ("Cattle", "FarmSupplies", "VetLife", "Food & Nutrition", "High Protein Dairy Cattle Feed 50kg"),
            "id-11134207-7qul9-ljdyzoryz84te3.jpg": ("Cat", "Food", "Royal Canin", "Food & Nutrition", "Royal Canin Persian Adult Cat Food"),
            "id-11134207-7rbk7-m7nvmve2n07518.jpg": ("Cat", "Food", "Royal Canin", "Food & Nutrition", "Me-O Gold Persian Cat Formula Food"),
            "Livestock_Water_Feeder.jpg": ("Cattle", "FarmSupplies", "VetLife", "Accessories & Feeding", "Heavy-Duty Livestock Water Feeder"),
            "Mineral_Mixture.jpg": ("Cattle", "FarmSupplies", "VetLife", "Supplements & Vitamins", "Minerva Feed Mineral Mixture Powder 1kg"),
            "OIP.jpg": ("Dog", "Accessories", "PetCare Plus", "Accessories & Feeding", "Adjustable Quick-Release Pet Collar"),
            "PetsSelectCatTreatsFish.jpg": ("Cat", "Treat", "Royal Canin", "Food & Nutrition", "Pets Select Gourmet Fish Cat Treats"),
            "Pet_Nutritional_Powder.jpg": ("Bird", "Supplement", "PetCare Plus", "Supplements & Vitamins", "Pet Nutritional Powder for Birds & Small Pets"),
            "ph-11134207-7r98x-lxavpu5ncy8x43.jpg": ("Dog", "Food", "Royal Canin", "Food & Nutrition", "Royal Canin Mini Adult Dog Food 2kg"),
            "Poultry_Feed.jpeg": ("Bird", "FarmSupplies", "VetLife", "Food & Nutrition", "Nature Power High Growth Poultry Feed 50kg"),
            "Puppy_Growth_Supplement.jpg": ("Dog", "Supplement", "PetCare Plus", "Supplements & Vitamins", "Puppy Growth & Vitality Health Supplement"),
            "Pur-Luv-Chicken-Jerky-1.jpg": ("Dog", "Treat", "PetCare Plus", "Food & Nutrition", "Pur-Luv Chicken Jerky Dog Treats"),
            "R.jpg": ("Dog", "Treat", "Pedigree", "Food & Nutrition", "Pedigree Schmackos Stix Puppy Treats"),
            "R_1.jpg": ("Cattle", "FarmSupplies", "VetLife", "Food & Nutrition", "Kalmbach Feeds Generations Calf Feed 50 lbs"),
            "Senior_Pet_Supplement.jpg": ("Cat", "Supplement", "PetCare Plus", "Supplements & Vitamins", "Senior Cat Wellness Supplement"),
            "sg-11134201-22110-zi8xch7fjikveb.jpg": ("Dog", "Grooming", "PetCare Plus", "Grooming & Hygiene", "My Pets Friend Deep Cleaning Dog Shampoo"),
            "sg-11134201-7qvdx-lhsl786rfcmw1b.jpg": ("Dog", "Grooming", "VetLife", "Grooming & Hygiene", "Dual-Sided Undercoat Deshedding Rake for Dogs"),
            "sg-11134201-7rd4v-lu4rbki12lnda9.jpg": ("Cat", "Grooming", "PetCare Plus", "Grooming & Hygiene", "Illuminated LED Claw & Nail Clipper for Cats"),
            "view.jpg": ("Cat", "Beds", "PetCare Plus", "Accessories & Feeding", "Ultra-Soft Sherpa Fleece Cat Blanket"),
        }

        if img_name in EXACT_IMAGE_MAP:
            p_type, prod_t, b_name, cat_name, p_name = EXACT_IMAGE_MAP[img_name]
            pet_type = p_type
            product_type = prod_t
            brand = brand_map[b_name]
            category = category_map[cat_name]
            name = p_name
            price = Decimal(str(random.randint(350, 1500)))
        elif "pedigree" in lower:
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
            pet_type = "Universal"
            price = Decimal(str(random.randint(500, 3500)))
            name = clean_name.title()
        elif "puppy" in lower or "dog" in lower:
            brand = brand_map["PetCare Plus"]
            category = category_map["Supplements & Vitamins"]
            product_type = "Supplement"
            pet_type = "Dog"
            price = Decimal(str(random.randint(350, 890)))
            name = clean_name.title()
        elif "cattle" in lower or "calf" in lower or "feed" in lower:
            brand = brand_map["VetLife"]
            category = category_map["Food & Nutrition"]
            product_type = "FarmSupplies"
            pet_type = "Cattle"
            price = Decimal(str(random.randint(400, 1500)))
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
