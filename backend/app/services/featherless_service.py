from openai import OpenAI

from app.core.config import (
    FEATHERLESS_API_KEY,
    FEATHERLESS_BASE_URL,
    FEATHERLESS_MODEL,
)


class FeatherlessService:

    def __init__(self):
        if not FEATHERLESS_API_KEY:
            raise ValueError("FEATHERLESS_API_KEY is not configured")

        self.client = OpenAI(
            api_key=FEATHERLESS_API_KEY,
            base_url=FEATHERLESS_BASE_URL,
        )

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=FEATHERLESS_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            temperature=0.1,
            max_tokens=1500,
        )

        return response.choices[0].message.content