import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = "greenhouse"
    COLLECTION_NAME: str = "history"
    INITIAL_MOISTURE: float = 20.0
    INITIAL_TEMPERATURE: float = 33.0

settings = Settings()
