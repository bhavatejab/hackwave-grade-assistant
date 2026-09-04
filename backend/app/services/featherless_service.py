import os
from openai import OpenAI

from app.core.config import (
    FEATHERLESS_API_KEY,
    FEATHERLESS_BASE_URL,
    FEATHERLESS_MODEL,
)


class FeatherlessService:

    def __init__(self):
        self.api_key = FEATHERLESS_API_KEY
        self.client = None
        if self.api_key:
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=FEATHERLESS_BASE_URL,
            )

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        if not self.client:
            from app.core.config import FEATHERLESS_API_KEY as CURRENT_KEY
            self.api_key = CURRENT_KEY or os.getenv("FEATHERLESS_API_KEY")
            if not self.api_key:
                raise ValueError("FEATHERLESS_API_KEY is not configured in backend/.env")
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=FEATHERLESS_BASE_URL,
            )

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