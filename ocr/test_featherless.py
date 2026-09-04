import os

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

api_key = os.getenv("FEATHERLESS_API_KEY")
model = os.getenv("FEATHERLESS_MODEL")

if not api_key:
    raise RuntimeError("FEATHERLESS_API_KEY is missing from .env")

if not model:
    raise RuntimeError("FEATHERLESS_MODEL is missing from .env")

client = OpenAI(
    base_url="https://api.featherless.ai/v1",
    api_key=api_key,
)

print(f"Testing Featherless model: {model}")

response = client.chat.completions.create(
    model=model,
    messages=[
        {
            "role": "user",
            "content": "Reply with exactly: Featherless connection successful."
        }
    ],
    temperature=0,
)

print("Model response:")
print(response.choices[0].message.content)