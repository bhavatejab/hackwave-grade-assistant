import os
from openai import OpenAI

from app.core import config


class FeatherlessService:

    def __init__(self):
        self.api_key = config.FEATHERLESS_API_KEY
        self.client = None
        if self.api_key:
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=config.FEATHERLESS_BASE_URL,
            )

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        if not self.client:
            from dotenv import load_dotenv
            load_dotenv(dotenv_path=config.ENV_PATH, override=True)
            self.api_key = os.getenv("FEATHERLESS_API_KEY", "").strip() or None
            if not self.api_key:
                raise ValueError("FEATHERLESS_API_KEY is not configured in backend/.env")
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=config.FEATHERLESS_BASE_URL,
            )

        response = self.client.chat.completions.create(
            model=config.FEATHERLESS_MODEL,
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