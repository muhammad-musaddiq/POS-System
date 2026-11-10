from fastapi import APIRouter
from app.api.v1.routes import auth, access_control, settings, health, import_export

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(access_control.users_router, prefix="/users", tags=["users"])
api_router.include_router(access_control.roles_router, prefix="/roles", tags=["roles"])
api_router.include_router(access_control.permissions_router, prefix="/permissions", tags=["permissions"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(import_export.router, prefix="/import-export", tags=["import-export"])
