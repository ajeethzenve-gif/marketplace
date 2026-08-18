from products.models import Product


def normalize(value):

    if not value:

        return ""

    return (
        str(value)
        .lower()
        .strip()
    )


def calculate_match_score(
    prescription_medicine,
    product
):

    score = 0

    prescription_name = normalize(
        prescription_medicine.get("name")
    )

    prescription_ingredient = normalize(
        prescription_medicine.get(
            "active_ingredient"
        )
    )

    prescription_strength = normalize(
        prescription_medicine.get(
            "strength"
        )
    )

    product_name = normalize(
        product.product_name
    )

    product_ingredient = ""

    product_dosage = ""

    try:

        product_ingredient = normalize(
            product.medicine.active_ingredient
        )

        product_dosage = normalize(
            product.medicine.dosage
        )

    except Exception:

        pass

    # Medicine name
    if (
        prescription_name
        and prescription_name in product_name
    ):

        score += 40

    # Active ingredient
    if (
        prescription_ingredient
        and prescription_ingredient
        in product_ingredient
    ):

        score += 35

    # Strength
    if (
        prescription_strength
        and prescription_strength
        in product_dosage
    ):

        score += 15

    # Pet type
    pet_type = normalize(
        prescription_medicine.get(
            "pet_type"
        )
    )

    product_pet_type = normalize(
        product.pet_type
    )

    if (
        pet_type
        and pet_type == product_pet_type
    ):

        score += 10

    return min(score, 100)


def find_matching_products(
    prescription_medicine
):

    products = Product.objects.filter(
        product_type="Medicine",
        is_available=True
    ).select_related(
        "medicine"
    )

    matches = []

    for product in products:

        score = calculate_match_score(
            prescription_medicine,
            product
        )

        if score >= 40:

            matches.append(
                {
                    "product": product,
                    "score": score
                }
            )

    matches.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return matches