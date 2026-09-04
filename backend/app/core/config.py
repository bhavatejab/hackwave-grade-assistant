import os
from dotenv import load_dotenv

load_dotenv()

FEATHERLESS_API_KEY = os.getenv("FEATHERLESS_API_KEY")

FEATHERLESS_BASE_URL = "https://api.featherless.ai/v1"

FEATHERLESS_MODEL = "Qwen/Qwen2.5-7B-Instruct"