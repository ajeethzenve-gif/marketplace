from django.conf import settings
from openai import OpenAI


def analyze_prescription(text):

    try:
        print("====================================")
        print("AI PRESCRIPTION ANALYSIS STARTED")
        print("API KEY EXISTS:", bool(settings.OPENAI_API_KEY))
        print("TEXT:", text[:1000])
        print("====================================")

        client = OpenAI(
            api_key=settings.OPENAI_API_KEY
        )

        response = client.responses.create(
            model="gpt-5-mini",
            input=f"""
You are a veterinary prescription analysis assistant.

Analyze the following veterinary prescription.

Extract:

1. Pet name
2. Pet type
3. Breed
4. Age
5. Weight
6. Medicine name
7. Active ingredient if available
8. Dosage
9. Frequency
10. Duration

Return the result in JSON format.

Prescription text:

{text}
"""
        )

        print("AI RESPONSE:")
        print(response.output_text)

        return response.output_text

    except Exception as e:

        print("====================================")
        print("AI PRESCRIPTION ERROR")
        print(type(e).__name__)
        print(str(e))
        print("====================================")

        raise