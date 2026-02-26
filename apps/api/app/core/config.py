from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    environment: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8006
    # Azure OpenAI
    azure_openai_api_key: str = ""
    azure_openai_endpoint: str = ""
    azure_openai_api_version: str = "2024-02-15-preview"
    azure_openai_deployment: str = "gpt-4o"
    chroma_path: str = "./chroma_data"
    database_url: str = ""
    ai_confidence_threshold: float = 0.90
    ai_review_threshold: float = 0.70

    model_config = ConfigDict(env_file=".env")


settings = Settings()
