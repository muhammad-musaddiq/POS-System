from app.core.config import settings
from app.schemas.health import HealthResponse


def get_health_status() -> HealthResponse:
    return HealthResponse(status="ok", service=settings.PROJECT_NAME)
